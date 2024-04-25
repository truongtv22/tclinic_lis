import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import { SerialPort } from 'serialport';
import { IpcChannel } from 'shared/ipcs';
import { LAB, WINDOW_ID } from 'shared/constants';
import { windowManager } from '../window';
import {
  LabParser,
  BW200Parser,
  Access2Parser,
  SysmexXP100Parser,
} from './parser';

export interface ConnectionData {
  id: string;
  lab: string;
  [key: string]: any;
}

export class Connection {
  id: string;
  data: ConnectionData;

  port: SerialPort;
  parser: LabParser;

  constructor(id: string, data: ConnectionData) {
    this.id = id;
    this.data = data;
    this.port = new SerialPort(this.openOptions);

    this.port.on('open', () => {
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
    });

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
      console.log(`Connection ${this.id} closed`, this.id);
    });

    this.port.on('error', (error) => {
      const window = windowManager.getWindow(WINDOW_ID.MAIN);
      if (window) {
        window.webContents?.send(IpcChannel.CONNECTION_ERROR, this.id, error);
      }
      console.log(`Error on connection ${this.id}`, error);
    });

    this.port.on('data', (buffer: Buffer) => {
      this.saveLog(buffer);
    });
  }

  get isOpen() {
    return this.port && this.port.isOpen;
  }

  get openOptions() {
    const options: any = {
      autoOpen: false,
      path: this.data.comport,
      baudRate: this.data.baudrate,
      dataBits: this.data.databits,
      stopBits: this.data.stopbits,
      parity: this.data.parity,
    };
    if (process.platform === 'win32') {
      options.rtsMode = this.data.rtsmode;
    }
    return options;
  }

  update(data: ConnectionData) {
    this.data = data;
    this.port = new SerialPort(this.openOptions);
  }

  open(options: any = {}) {
    const retryCount = options.retryCount || 0;
    const maxRetries = options.maxRetries || 5;
    const retryDelay = options.retryDelay || 2000;

    this.port.open((error) => {
      if (error && options.retry) {
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
          console.error(`Max retry attempts reached for connection ${this.id}`);
        }
      }
    });
  }

  close() {
    if (this.port && this.port.isOpen) {
      this.port.close();
    }
  }

  saveLog(buffer: Buffer) {
    const folderLog = path.join(process.cwd(), 'log', this.data.lab);
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
