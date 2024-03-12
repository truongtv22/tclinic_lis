import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import installExtension, {
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
let port: any = null;

ipcMain.on('serialport-connect', (event, options) => {
  port = new SerialPort({ path: options.path, baudRate: options.baudRate });
  const parser = new ReadlineParser({ delimiter: '\r\n' });
  port.pipe(parser);

  // parser: SerialPort.parsers.byteDelimiter([[0x02], [0x0D]])

  port.on('open', () => {
    console.log('serial port open');
  });

  port.on('error', (error) => {
    console.log('serial port error', error);
  });

  port.on('close', () => {
    console.log('serial port close');
  });

  port.on('data', (data) => {
    console.log(
      'serial port data',
      data,
      JSON.stringify(data.toString()),
      JSON.stringify(data.toString('hex')),
    );
    event.reply('serialport-data', data.toString());
  });
});

ipcMain.on('serialport-disconnect', (event, options) => {
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

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new StatefullBrowserWindow({
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

  // Open the DevTools.
  mainWindow.webContents.on('did-finish-load', () => {
  //   // We close the DevTools so that it can be reopened and redux reconnected.
  //   // This is a workaround for a bug in redux devtools.
  //   mainWindow.webContents.closeDevTools();
  //   mainWindow.webContents.once('devtools-opened', () => {
  //     mainWindow.focus();
  //   });
    mainWindow.webContents.openDevTools();
  });
};

const loadExtension = async () => {
  try {
    const result = await installExtension(
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
  loadExtension();
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
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
