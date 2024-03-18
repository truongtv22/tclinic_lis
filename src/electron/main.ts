import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import installExtensions, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import Store from 'electron-store';
import { SerialPort, ReadlineParser } from 'serialport';
import { initDatabase } from './database';
import { ByteLengthParser } from '@serialport/parser-byte-length';
import connectmanageApi from './database/connectmanageApi';
import { StatefullBrowserWindow } from 'stateful-electron-window';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let viewWindow: BrowserWindow | null = null;

// IPC Window
ipcMain.on('main-window-reload', () => {
  mainWindow?.reload();
});

ipcMain.on('open-view-window', () => {
  openViewWindow();
});

// IPC Electron Store
const store = new Store();

ipcMain.on('electron-store-get', async (event, key) => {
  event.returnValue = store.get(key);
});
ipcMain.on('electron-store-set', async (event, key, value) => {
  store.set(key, value);
});
ipcMain.on('electron-store-delete', async (event, key) => {
  store.delete(key);
});

// IPC SerialPort
let port: SerialPort = null;

ipcMain.on('serialport-connect', (event, params) => {
  const options: any = {
    path: params.comport,
    baudRate: params.baudrate,
    dataBits: params.databits,
    stopBits: params.stopbits,
    parity: params.parity,
  };
  if (process.platform === 'win32') {
    options.rtsMode = params.rtsmode;
  }
  port = new SerialPort(options);
  const parser = new ReadlineParser({ delimiter: '\r\n' });
  port.pipe(parser);

  // parser: SerialPort.parsers.byteDelimiter([[0x02], [0x0D]])

  port.on('open', () => {
    console.log('serial port open');
    event.reply('serialport-open');
  });

  port.on('error', (error: any) => {
    console.log('serial port error', error);
    event.reply('serialport-error', error);
  });

  port.on('close', () => {
    console.log('serial port close');
    event.reply('serialport-close');
  });

  port.on('data', (data: any) => {
    console.log(
      'serial port data',
      data,
      JSON.stringify(data.toString()),
      JSON.stringify(data.toString('hex')),
    );
    event.reply('serialport-data', data.toString());
  });
});

ipcMain.on('serialport-disconnect', (event) => {
  if (port) {
    port.close();
  }
});

// IPC Connect manage
ipcMain.handle('connectmanage-get', async (event) => {
  const result = connectmanageApi.getAll();
  return result;
});

ipcMain.handle('connectmanage-create', async (event, values) => {
  const result = connectmanageApi.create(values);
  return result;
});

ipcMain.handle('connectmanage-update', async (event, values) => {
  const result = connectmanageApi.update(values);
  return result;
});

ipcMain.handle('connectmanage-delete', async (event, id) => {
  const result = connectmanageApi.delete(id);
  return result;
});

const createWindow = () => {
  // Create the browser window.
  mainWindow = new StatefullBrowserWindow({
    width: 1270,
    height: 860,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Remove the linux, window menu bar
  // mainWindow.removeMenu();
  // Disable macOS menu bar
  // Menu.setApplicationMenu(Menu.buildFromTemplate([]));

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open the DevTools.
  mainWindow?.webContents.on('did-finish-load', () => {
    // We close the DevTools so that it can be reopened and redux reconnected.
    // This is a workaround for a bug in redux devtools.
    // mainWindow?.webContents.closeDevTools();
    // mainWindow?.webContents.once('devtools-opened', () => {
    //   mainWindow?.focus();
    // });
    mainWindow?.webContents.openDevTools();
  });
};

const openViewWindow = () => {
  if (viewWindow) {
    viewWindow.focus();
    return;
  }

  viewWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    viewWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/#/view`);
  } else {
    viewWindow.loadFile(
      path.join(
        __dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html/#/view`,
      ),
    );
  }

  viewWindow.on('close', () => {
    viewWindow = null;
  });
};

const loadExtensions = async () => {
  try {
    const result = await installExtensions(
      [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS],
      { loadExtensionOptions: { allowFileAccess: true } },
    );
    console.log(`Added Extension:  ${result}`);
  } catch (error) {
    console.log('An error occurred: ', error);
  }
};

const listSerialPorts = async () => {
  try {
    const ports = await SerialPort.list();
    console.log('SerialPort:ports', ports);
  } catch (error) {
    console.log('[Error] SerialPort', error);
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  loadExtensions();
  initDatabase();
  createWindow();
  // listSerialPorts();

  // https://stackoverflow.com/a/19733677
  // socat -d -d pty,raw,echo=0 pty,raw,echo=0
  // cat < /dev/ttys003
  // echo "Test" > /dev/ttys004
  // const port = new SerialPort({ path: '/dev/ttys004', baudRate: 9600 });

  // port.write('main screen turn on', function(err) {
  //   if (err) {
  //     return console.log('Error on write: ', err.message)
  //   }
  //   console.log('message written')
  // })

  // // Open errors will be emitted as an error event
  // port.on('error', function (err) {
  //   console.log('Error: ', err.message);
  // });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
  // if (BrowserWindow.getAllWindows().length === 0) {
  //   createWindow();
  // }
});
