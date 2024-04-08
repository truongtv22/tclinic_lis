import { app, BrowserWindow, ipcMain, Menu, Notification } from 'electron';
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
import axios from 'axios';
import { mainReduxBridge } from 'reduxtron/main';
import { ipcMain as sharedIpcMain } from 'shared/ipcs';
import { store } from './store';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let viewWindow: BrowserWindow | null = null;

const { unsubscribe } = mainReduxBridge(ipcMain, store);

// IPC Window
ipcMain.on('main-window-reload', (event) => {
  mainWindow?.reload();
});

ipcMain.on('open-view-window', (event) => {
  openViewWindow();
});

// IPC Electron Store
const storage = new Store();

ipcMain.on('electron-store-get', async (event, key) => {
  event.returnValue = storage.get(key);
});
ipcMain.on('electron-store-set', async (event, key, value) => {
  storage.set(key, value);
});
ipcMain.on('electron-store-delete', async (event, key) => {
  storage.delete(key);
});

// IPC SerialPort
const portManager: { [key: string]: SerialPort } = {};
// let port: SerialPort = null;

const ASCII = {
  STX: 0x02,
  ETX: 0x03,
  EOT: 0x04,
  ENQ: 0x05,
  ACK: 0x06,
};

// https://github.com/serialport/node-serialport/issues/1178
class BW200Parser extends Transform {
  buffer: Buffer;

  constructor(options = {}) {
    super(options);
    // buffer = [ASCII.STX...ASCII.ETX]
    this.buffer = Buffer.alloc(0);
  }

  _transform(chunk: Buffer, encoding: BufferEncoding, cb: TransformCallback) {
    const chunkLength = chunk.length;
    for (let i = 0; i < chunkLength; i++) {
      if (chunk[i] === ASCII.ETX) {
        // buffer = [ASCII.STX...]
        if (this.buffer[0] === ASCII.STX) this.push(this.buffer);
        this.buffer = Buffer.alloc(0);
      } else if (chunk[i] === ASCII.STX) {
        // buffer = [ASCII.STX]
        this.buffer = Buffer.from([ASCII.STX]);
      } else if (this.buffer[0] === ASCII.STX) {
        // buffer = [ASCII.STX...chunk[i] ]
        this.buffer = Buffer.concat([this.buffer, Buffer.from([chunk[i]])]);
      }
    }
    cb();
  }
}

class Access2Parser extends Transform {
  buffer: Buffer;

  constructor(options = {}) {
    super(options);
    // buffer = [ASCII.ENQ...ASCII.EOT]
    this.buffer = Buffer.alloc(0);
  }

  _transform(chunk: Buffer, encoding: BufferEncoding, cb: TransformCallback) {
    const chunkLength = chunk.length;
    for (let i = 0; i < chunkLength; i++) {
      if (chunk[i] === ASCII.EOT) {
        // buffer = [ASCII.ENQ...]
        if (this.buffer[0] === ASCII.ENQ) this.push(this.buffer);
        this.buffer = Buffer.alloc(0);
      } else if (chunk[i] === ASCII.ENQ) {
        // buffer = [ASCII.ENQ]
        this.buffer = Buffer.from([ASCII.ENQ]);
      } else if (this.buffer[0] === ASCII.ENQ) {
        // buffer = [ASCII.ENQ...chunk[i] ]
        this.buffer = Buffer.concat([this.buffer, Buffer.from([chunk[i]])]);
      }
    }
    cb();
  }
}

ipcMain.on(
  'serialport-connect',
  async (event, { id, lab, comp, ...params }) => {
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

    if (!portManager[id]) {
      portManager[id] = new SerialPort(options);
    }

    // Create folder if doesnt exist
    const folderBackup = path.join(process.cwd(), 'log', lab);
    const fileName = `${dayjs().format('YYYYMMDD')}.txt`;
    const filePath = path.join(folderBackup, fileName);

    if (!fs.existsSync(folderBackup)) {
      fs.mkdirSync(folderBackup, { recursive: true });
    }

    // Write data to log file
    portManager[id].on('data', (buffer: Buffer) => {
      fs.appendFile(filePath, buffer.toString(), (error) => {
        if (error) {
          console.log('Error write backup file', error);
        } else {
          console.log('Write backup file successfully:', filePath);
        }
      });
    });

    // #region Access 2
    // const parser = new Access2Parser();
    // portManager[id].pipe(parser);

    // portManager[id].on('data', (buffer: Buffer) => {
    //   // Send ACK when ENQ is received
    //   if (parser.buffer[0] === ASCII.ENQ) {
    //     portManager[id].write(Buffer.from([ASCII.ACK]));
    //     portManager[id].drain((error) => {
    //       if (error) console.log('PortManager write error', error);
    //     });
    //   }
    // });

    // parser.on('data', async (buffer: Buffer) => {
    //   const str = buffer
    //     .toString()
    //     .replace(/[\u0000-\u001F\u007F-\u009F]/g, '\n') // Use regex to match Control characters in Unicode and replace them with newline
    //     .replace(/^\s+|\s+$/g, '') // Remove leading and trailing whitespace
    //     .replace(/\r\n/g, '\n') // Replace "\r\n" with "\n"
    //     .replace(/\n{2,}/g, '\n'); // Remove duplicate newline characters

    //   const lines = str.split('\n');
    //   if (!lines || !lines.length) return;

    //   /**
    //    * Regex match `1H|\^&|||ACCESS^503884|||||LIS||P|1|20240330104322`
    //    */
    //   const regex = /^.*ACCESS.*(?<datetime>[0-9]{14})$/;
    //   if (!regex.test(lines[0])) return;

    //   const datetime = lines[0].match(regex)?.groups?.datetime;
    //   if (!datetime) return;

    //   /**
    //    * Regex match `2P|1|HOANG PHUONG`
    //    */
    //   const regex1 = /(?<person>[a-zA-Z0-9\s]+)$/;
    //   const person = lines[2].match(regex1)?.groups?.person;
    //   if (!person) return;

    //   /**
    //    * Regex match `3O|1|0012P|^1302^4|^^^HCG5^1|||||||||||Serum||||||||||F`
    //    */
    //   // match text 3O|1|0012P|^1302^4|^^^HCG5^1|||||||||||Serum||||||||||F
    //   const regex2 = /(?<barcode>[0-9]{3,})[a-zA-Z0-9]*/;
    //   const barcode = lines[4].match(regex2)?.groups?.barcode;
    //   if (!barcode) return;

    //   /**
    //    * Regex match `4R|1|^^^HCG5^1|342.22|mIU/mL||N||F||||20240330104401|503884`
    //    */
    //   const regex3 =
    //     /\^{3}(?<chiso>[a-zA-Z0-9-]+)\^[0-9]+\|(?<ketqua>[>\-+]?[0-9.]+)\|/;
    //   const { chiso, ketqua } = lines[6].match(regex3)?.groups || {};

    //   const result = {
    //     datetime,
    //     person,
    //     barcode,
    //     chiso,
    //     ketqua,
    //   };
    //   console.log('result', result);
    // });
    // #endregion

    // const connDevice: any = connectmanageApi.getById(id)?.data;

    // #region BW200
    const parser = new BW200Parser();
    portManager[id].pipe(parser);

    parser.on('data', async (buffer: Buffer) => {
      // Use regex to match Control characters in Unicode and replace them with an empty string
      // https://en.wikipedia.org/wiki/Control_character#In_Unicode
      const str = buffer
        .toString()
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '\n') // Use regex to match Control characters in Unicode and replace them with newline
        .replace(/^\s+|\s+$/g, '') // Remove leading and trailing whitespace
        .replace(/\r\n/g, '\n') // Replace "\r\n" with "\n"
        .replace(/\n{2,}/g, '\n'); // Remove duplicate newline characters

      const lines = str.split('\n');
      if (!lines || !lines.length) return;

      /**
       * Regex match `BIOWAY B-11  001-001`
       */
      const regex = /^BIOWAY[A-Za-z0-9-\s]*\s+\d{3,}-(?<barcode>\d{3,})$/;
      if (!regex.test(lines[0])) return;

      // Extract computer and barcode
      const barcode = lines[0].match(regex)?.groups?.barcode; // BIOWAY B-11  001-001
      if (!barcode) return;

      const result: any = {
        datetime: new Date().toISOString(),
      };
      result.barcode = barcode;

      // Extract other indexes
      for (let i = 1; i < lines.length; i++) {
        /**
         * Extract index and value
         * `URO -`
         * `SG  1.015`
         * `VC  +-`
         */
        const chisoRegex = /(?<chiso>[A-Z]+)\s*(?<ketqua>[.\S]*)\s*/i;
        const found = lines[i].match(chisoRegex);
        if (found) {
          let { chiso, ketqua } = found.groups;
          if (ketqua === '-') ketqua = 'Âm tính';
          if (ketqua === '+-') ketqua = '+Âm tính';
          result[chiso] = ketqua;
        }
      }

      // Save into result table
      const data = kqBW200Api.create(result)?.data;
      event.reply('serialport-data', data);

      if (!mainWindow.isFocused()) {
        const notification = new Notification({
          title: 'Kết quả xét nghiệm',
          body: `Nhận được kết quả từ ${comp}, bạn muốn xem kết quả này không?`,
        });
        notification.on('click', () => {
          if (!mainWindow.isFocused()) {
            if (!mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
          }
          event.reply('notification-data', data);
        });
        notification.show();
      }
    });
    // #endregion

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
      portManager[id] = null;
    });
  },
);

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

// IPC KQ BW200
ipcMain.handle('kqbw200-get', async (event) => {
  const result = kqBW200Api.getAll();
  return result;
});

ipcMain.handle('dong-bo-his', async (event: any, data) => {
  const dmchiso = dmkhopmaApi.getByLab('BW200')?.data;
  const chisoById: any = {};
  for (let i = 0; i < dmchiso.length; i++) {
    const chiso: any = dmchiso[i];
    chisoById[chiso.maxn] = chiso.macs;
  }

  const postData: any = {
    mamay: 'BW200',
    barcode: data.barcode_edit || data.barcode,
    kqxetnghiem: [],
    ngaythuchien: new Date(data.datetime).toISOString(),
    loaidongbo: 'ONE',
  };
  for (const chiso in chisoById) {
    const chiso_id = chisoById[chiso];
    postData.kqxetnghiem.push({
      chiso_id,
      maxn: chiso,
      ketqua: data[chiso],
    });
  }

  try {
    const result = await axios.post(
      'https://demo.tclinic.io/api/xetnghiem/lis-sync',
      postData,
    );
    if (result.data && result.data.success) {
      kqBW200Api.patch(data.id, { sendhis: 1 });
      return {
        success: true,
        message: result.data.message,
      };
    } else {
      return {
        success: false,
        message: 'Đông bộ kết quả không thành công',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message,
    };
  }
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

  ipcMain.on('subscribe', async (state: unknown) => {
    if (mainWindow?.isDestroyed()) return;
    mainWindow?.webContents?.send('subscribe', state);
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
      sandbox: false,
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

app.on('quit', unsubscribe);
