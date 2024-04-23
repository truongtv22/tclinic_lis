import { SerialPort } from 'serialport';
import { WINDOW_ID } from 'shared/constants/window';
import { windowManager } from '../window/manager';

export class Connection {
  id: string;
  data: any;
  port: SerialPort;

  constructor(id: string, data: any) {
    this.id = id;
    this.data = data;
  }

  setData(data: any) {
    this.data = data;
  }

  create() {
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

    this.port = new SerialPort(options);

    this.port.on('open', () => {
      console.log('Connection opened', this.id);
    });

    this.port.on('close', () => {
      console.log('Connection closed', this.id);
    });

    this.port.on('error', (error) => {
      console.log('Connection error', this.id, error);
    });
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
            this.open({ retryCount: retryCount + 1 });
          }, retryDelay);
        } else {
          console.error(
            'Maximum number of connection attempts exceeded',
            this.id,
          );
        }
      }
    });
  }

  close() {
    if (this.port && this.port.isOpen) {
      this.port.close();
    }
  }
}
