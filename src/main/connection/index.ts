import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import { SerialPort } from 'serialport';
import { LAB } from 'shared/constants';
import { WINDOW_ID } from 'shared/constants/window';
import { windowManager } from '../window/manager';
import { LabParser } from './parsers/LabParser';
import { BW200Parser } from './parsers/BW200Parser';
import { Access2Parser } from './parsers/Access2Parser';
import { SysmexXP100Parser } from './parsers/SysmexXP100Parser';

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
      console.log(`Connection ${this.id} opened`);
    });

    this.port.on('close', () => {
      console.log(`Connection ${this.id} closed`, this.id);
    });

    this.port.on('error', (error) => {
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
      if (!error) {
        switch (this.data.lab) {
          case LAB.BW200:
            this.parser = new BW200Parser(this.id);
            break;
          case LAB.Access2:
            this.parser = new Access2Parser(this.id);
            break;
          case LAB.SysmexXP100:
            this.parser = new SysmexXP100Parser(this.id);
            break;
        }

        this.port.pipe(this.parser.transform);
      } else if (options.retry) {
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
