import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import { SerialPort } from 'serialport';
import { IpcChannel } from 'shared/ipcs';
import { WINDOW_ID, LAB, CONNECT_TYPE, CONNECT_STATUS } from 'shared/constants';
import { windowManager } from '../window';
import {
  LabParser,
  BW200Parser,
  Access2Parser,
  SysmexXP100Parser,
} from './parser';

export interface ConnectionData {
  id: number;
  lab: string;
  kieuketnoi: string;
  [key: string]: any;
}

export interface ConnectionControl {
  rtscts: boolean;
  xon: boolean;
  xoff: boolean;
  xany: boolean;
  brk: boolean;
  cts: boolean;
  dsr: boolean;
  dtr: boolean;
  rts: boolean;
}

export class Connection {
  id: number;
  data: ConnectionData;
  control?: ConnectionControl;

  port: SerialPort;
  parser: LabParser;

  status = CONNECT_STATUS.NONE;
  statusError: any = null;

  constructor(id: number, data: ConnectionData, control?: ConnectionControl) {
    this.id = id;
    this.data = data;
    this.control = control;
    this.init();
  }

  get isOpen() {
    return this.port && this.port.isOpen;
  }

  get openOptions() {
    const options: any = {
      path: this.data.comport,
      baudRate: this.data.baudrate,
      dataBits: this.data.databits,
      stopBits: this.data.stopbits,
      parity: this.data.parity,
      autoOpen: false,
    };
    if (this.control) {
      options.rtscts = this.control.rtscts;
      options.xon = this.control.xon;
      options.xoff = this.control.xoff;
      options.xany = this.control.xany;
    }
    if (process.platform === 'win32') {
      options.rtsMode = this.data.rtsmode;
    }
    return options;
  }

  init() {
    if (this.data.kieuketnoi === CONNECT_TYPE.SerialPort) {
      console.log(`Init connection ${this.id}`, this.openOptions);
      this.port = new SerialPort(this.openOptions);

      switch (this.data.lab) {
        case LAB.BW200:
          this.parser = new BW200Parser(this);
          break;
        case LAB.Access2:
          this.parser = new Access2Parser(this);
          break;
        case LAB.SysmexXP100:
          this.parser = new SysmexXP100Parser(this);
          break;
      }

      this.port.on('open', () => {
        const window = windowManager.getWindow(WINDOW_ID.MAIN);
        if (window) {
          window.webContents?.send(IpcChannel.CONNECTION_OPENED, this.id);
        }
        console.log(`Connection ${this.id} opened`);
      });

      this.port.on('close', () => {
        const window = windowManager.getWindow(WINDOW_ID.MAIN);
        if (window) {
          window.webContents?.send(IpcChannel.CONNECTION_CLOSED, this.id);
        }
        this.destroy();
        console.log(`Connection ${this.id} closed`);
      });

      this.port.on('error', (error: Error, retry?: boolean) => {
        const window = windowManager.getWindow(WINDOW_ID.MAIN);
        if (window) {
          window.webContents?.send(
            IpcChannel.CONNECTION_ERROR,
            this.id,
            error.message,
            retry,
          );
        }
        console.log(`Error on connection ${this.id}`, error, retry);
      });

      this.port.on('data', (buffer: Buffer) => {
        this.saveLog(buffer);
      });
    }
  }

  update(data: ConnectionData, control?: ConnectionControl) {
    console.log(`Update connection ${this.id}`);
    this.data = data;
    this.control = control;
    this.init();
  }

  setControl(control: ConnectionControl) {
    this.control = control;
  }

  open(options: any = {}) {
    console.log(`Open connection ${this.id}`);
    if (this.data.kieuketnoi === CONNECT_TYPE.SerialPort) {
      const retryCount = options.retryCount || 0;
      const maxRetries = options.maxRetries || 2;
      const retryDelay = options.retryDelay || 2000;

      this.port.open((error) => {
        if (!error && this.control) {
          const setOptions: any = {
            brk: this.control.brk,
            cts: this.control.cts,
            dsr: this.control.dsr,
            dtr: this.control.dtr,
            rts: this.control.rts,
          };
          console.log(`Set control of connection ${this.id}`, setOptions);
          this.port.set(setOptions, (error) => {
            if (!error) {
              console.log(`Set control of connection ${this.id} successfully`);
            } else {
              console.log(`Error set control of connection ${this.id}`, error);
            }
          });
        }
        if (error) {
          this.port.emit('error', error, options.retry);
          if (options.retry) {
            // Check if the maximum number of connection attempts has been exceeded
            if (retryCount < maxRetries) {
              // Retry after certain time
              setTimeout(() => {
                console.log(
                  `Retry attempt ${retryCount + 1} for connection ${this.id}`,
                );
                this.open({ retry: options.retry, retryCount: retryCount + 1 });
              }, retryDelay);
            } else {
              console.error(
                `Max retry attempts reached for connection ${this.id}`,
              );
            }
          }
        }
      });
    }
  }

  close() {
    console.log(`Close connection ${this.id}`);
    if (this.data.kieuketnoi === CONNECT_TYPE.SerialPort) {
      if (this.port && this.port.isOpen) {
        this.port.close();
      }
    }
  }

  destroy() {
    console.log(`Destroy connection ${this.id}`);
    if (this.data.kieuketnoi === CONNECT_TYPE.SerialPort) {
      this.parser.destroy();
    }
  }

  saveLog(buffer: Buffer) {
    console.log(`Save log for connection ${this.id}`);
    const folderLog = path.join(app.getPath('userData'), 'logs', this.data.lab);
    const fileName = `${dayjs().format('YYYYMMDD')}.txt`;
    const filePath = path.join(folderLog, fileName);

    // Create folder if doesnt exist
    if (!fs.existsSync(folderLog)) {
      fs.mkdirSync(folderLog, { recursive: true });
    }

    // Write data to log file
    fs.appendFile(filePath, buffer.toString(), (error) => {
      if (error) {
        console.log('Error write log file', error);
      } else {
        console.log('Write log file successfully', filePath);
      }
    });
  }
}
