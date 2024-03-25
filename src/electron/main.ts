import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import installExtensions, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import Store from 'electron-store';
import { SerialPort } from 'serialport';
import { initDatabase } from './database';
import { Transform, TransformCallback, TransformOptions } from 'stream';
import kqBW200Api from './database/kqBW200Api';
import dmkhopmaApi from './database/dmkhopma';
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
const portManager: { [key: string]: SerialPort } = {};
// let port: SerialPort = null;

// https://github.com/serialport/node-serialport/issues/1178
class SlipParser extends Transform {
  buffer: Buffer;

  constructor(options = {}) {
    super(options);
    this.buffer = Buffer.alloc(0);
  }

  _transform(chunk: Buffer, encoding: BufferEncoding, cb: TransformCallback) {
    const chunkLength = chunk.length;
    for (let i = 0; i < chunkLength; i++) {
      if (chunk[i] === 0x03 /* ETX */) {
        if (this.buffer[0] === 0x02) this.push(this.buffer);
        this.buffer = Buffer.alloc(0);
      } else if (chunk[i] === 0x02 /* STX */) {
        this.buffer = Buffer.from([0x02]);
      } else if (this.buffer[0] === 0x02 /* STX */) {
        this.buffer = Buffer.concat([this.buffer, Buffer.from([chunk[i]])]);
      }
    }
    cb();
  }
}

ipcMain.on('serialport-connect', async (event, { id, lab, ...params }) => {
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
  portManager[id] = new SerialPort(options);

  // Create folder if doesnt exist
  const folderBackup = path.join(process.cwd(), 'backup/BW200');
  const fileName = `${dayjs().format('YYYYMMDD')}.txt`;
  const filePath = path.join(folderBackup, fileName);

  if (!fs.existsSync(folderBackup)) {
    fs.mkdirSync(folderBackup, { recursive: true });
  }

  const parser = new SlipParser();
  portManager[id].pipe(parser);

  const connDevice: any = connectmanageApi.getById(id)?.data;

  parser.on('data', async (data: Buffer) => {
    // Use regex to match Control characters in Unicode and replace them with an empty string
    // https://en.wikipedia.org/wiki/Control_character#In_Unicode
    const str = data
      .toString()
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '\n') // Use regex to match Control characters in Unicode and replace them with newline
      .replace(/^\s+|\s+$/g, '') // Remove leading and trailing whitespace
      .replace(/\r\n/g, '\n') // Replace "\r\n" with "\n"
      .replace(/\n{2,}/g, '\n'); // Remove duplicate newline characters

    // Write data to backup file
    fs.appendFile(filePath, `${str}\n`, (error) => {
      if (error) {
        console.log('Error write backup file', error);
      } else {
        console.log('Write backup file successfully:', filePath);
      }
    });

    const lines = str.split('\n');
    const result: any = { datetime: Date.now() };

    // Extract computer and barcode
    const barcode = lines[0] // BIOWAY B-11  001-001
      .split('-') // split string with separator -
      .at(-1) // get last string
      .padStart(4, '0'); // fill zero at start
    result.barcode = barcode;

    // Extract other indexes
    for (let i = 1; i < lines.length; i++) {
      const dataIndex = lines[i]
        .replace(/^\s+|\s+$/g, '') // Remove leading and trailing whitespace
        .replace(/\s{2,}/g, ' '); // Remove duplicate whitespace
      const parts = dataIndex.split(' ');
      const len = parts.length;
      if (len > 1) {
        const chiso = parts.slice(0, -1).join(' ');
        const value = parts.at(-1) === '-' ? 'Âm tính' : parts.at(-1);
        result[chiso] = value;
      } else if (len > 0) {
        const chiso = parts[0];
        result[chiso] = null;
      }
    }

    // Save into result table
    kqBW200Api.create(result);

    const dmchiso = dmkhopmaApi.getByLab(connDevice?.lab)?.data;
    const chisoById: any = {};
    for (let i = 0; i < dmchiso.length; i++) {
      const chiso: any = dmchiso[i];
      chisoById[chiso.maxn] = chiso.macs;
    }

    // const payload: any = {};
    // payload.mamay = connDevice?.lab;
    // payload.barcode = barcode;
    // payload.kqxetnghiem = [];
    // payload.loaidongbo = connDevice?.loaidongbo === 1 ? 'ONE' : '';
    // payload.ngaythuchien = new Date(result.datetime).toISOString();

    // for (const chiso in chisoById) {
    //   const chiso_id = chisoById[chiso];
    //   payload.kqxetnghiem.push({
    //     chiso_id,
    //     maxn: chiso,
    //     ketqua: result[chiso],
    //   });
    // }

    event.reply('serialport-data', result);
  });

  portManager[id].on('open', () => {
    console.log('serial port open');
    event.reply('serialport-open');
  });

  portManager[id].on('error', (error: any) => {
    console.log('serial port error', error);
    event.reply('serialport-error', error);
  });

  portManager[id].on('close', () => {
    console.log('serial port close');
    event.reply('serialport-close');
  });

  // parser.on('data', (data: any) => {
  //   event.reply('serialport-data', data.toString());
  // });
});

ipcMain.on('serialport-disconnect', (event, { id }) => {
  if (portManager[id] && portManager[id].isOpen) {
    portManager[id].close();
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
