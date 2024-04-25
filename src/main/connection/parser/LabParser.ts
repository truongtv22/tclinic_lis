import { Transform } from 'stream';
import { Connection } from '../index';

export const ASCII_CODE = {
  STX: 2, // 0x02,
  ETX: 3, // 0x03,
  EOT: 4, // 0x04,
  ENQ: 5, // 0x05,
  ACK: 6, // 0x06,
  LF: 10, // 0x0a,
  SUB: 26, // 0x1a,
};

export class LabParser {
  transform: Transform;
  connection: Connection

  constructor(connection: Connection) {
    this.connection = connection;
    this.connection.port.pipe(this.transform);
    
    this.connection.port.on('data', (buffer: Buffer) => {
      this.prepare(buffer);
    });

    this.transform.on('data', (buffer: Buffer) => {
      const data = this.parse(buffer);
      if (data) this.save(data);
    });
  }

  prepare(buffer: Buffer) {}

  parse(buffer: Buffer): any {}

  save(data: any) {}
}
