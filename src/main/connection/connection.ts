import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import { SerialPort } from 'serialport';
import Log from 'electron-log';
import { IpcChannel } from 'shared/ipcs';
import { WINDOW_ID, LAB, CONNECT_TYPE, CONNECT_STATUS } from 'shared/constants';
import { asciiToText } from 'shared/utils/ascii';
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

export interface ConnectionConfig {
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
  config?: ConnectionConfig;

  port: SerialPort;
  parser: LabParser;
  
  logger: Log.LogFunctions;

  status = CONNECT_STATUS.NONE;
  statusError: any = null;

  constructor(id: number, data: ConnectionData, config?: ConnectionConfig) {
    this.id = id;
    this.data = data;
    this.config = config;
    this.logger = Log.scope(`connection-${this.id}`);
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
    if (this.config) {
      options.rtscts = this.config.rtscts;
      options.xon = this.config.xon;
      options.xoff = this.config.xoff;
      options.xany = this.config.xany;
    }
    if (process.platform === 'win32') {
      options.rtsMode = this.data.rtsmode;
    }
    return options;
  }

  init() {
    if (this.data.kieuketnoi === CONNECT_TYPE.SerialPort) {
      this.logger.log('Init connection', this.openOptions);
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
        this.logger.log('Connection opened');
      });

      this.port.on('close', () => {
        const window = windowManager.getWindow(WINDOW_ID.MAIN);
        if (window) {
          window.webContents?.send(IpcChannel.CONNECTION_CLOSED, this.id);
        }
        this.destroy();
        this.logger.log('Connection closed');
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
        this.logger.log('Connection error', error, retry);
      });

      this.port.on('data', (buffer: Buffer) => {
        this.saveLog(buffer);
      });
    }
  }

  update(data: ConnectionData, config?: ConnectionConfig) {
    this.logger.log('Update connection');
    this.data = data;
    this.config = config;
    this.init();
  }

  setConfig(config: ConnectionConfig) {
    this.config = config;
  }

  open(options: any = {}) {
    this.logger.log('Open connection');
    if (this.data.kieuketnoi === CONNECT_TYPE.SerialPort) {
      const retryCount = options.retryCount || 0;
      const maxRetries = options.maxRetries || 2;
      const retryDelay = options.retryDelay || 2000;

      this.port.open((error) => {
        if (!error && this.config) {
          const setOptions: any = {
            brk: this.config.brk,
            cts: this.config.cts,
            dsr: this.config.dsr,
            dtr: this.config.dtr,
            rts: this.config.rts,
          };
          this.logger.log('Set control', setOptions);
          this.port.set(setOptions, (error) => {
            if (!error) {
              this.logger.log('Set control successfully', setOptions);
            } else {
              this.logger.log('Error set control', error);
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
                this.logger.log(`Retry attempt ${retryCount + 1}`);
                this.open({ retry: options.retry, retryCount: retryCount + 1 });
              }, retryDelay);
            } else {
              this.logger.log('Max retry attempts reached');
            }
          }
        }
      });
    }
  }

  close() {
    this.logger.log('Close connection');
    if (this.data.kieuketnoi === CONNECT_TYPE.SerialPort) {
      if (this.port && this.port.isOpen) {
        this.port.close();
      }
    }
  }

  destroy() {
    this.logger.log('Destroy connection');
    if (this.data.kieuketnoi === CONNECT_TYPE.SerialPort) {
      this.parser.destroy();
    }
  }

  saveLog(buffer: Buffer) {
    this.logger.log('Start save log');
    const folderLog = path.join(app.getPath('userData'), 'logs', this.data.lab);
    const fileName = `${dayjs().format('YYYYMMDD')}.txt`;
    const filePath = path.join(folderLog, fileName);

    // Create folder if doesnt exist
    if (!fs.existsSync(folderLog)) {
      fs.mkdirSync(folderLog, { recursive: true });
    }

    this.logger.log('Save content log', asciiToText(buffer.toString()));

    // Write data to log file
    fs.appendFile(filePath, buffer.toString(), (error) => {
      if (error) {
        this.logger.log('Error write log file', error);
      } else {
        this.logger.log('Write log file successfully', filePath);
      }
    });
  }
}
