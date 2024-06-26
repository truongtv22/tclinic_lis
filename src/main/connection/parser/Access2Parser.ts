import { Transform, TransformCallback } from 'stream';
import { ASCII_CODE, LAB } from 'shared/constants';
import { parseString } from 'shared/utils/date';
import kqAccess2Db from 'main/database/kqAccess2';
import dmMaOnlineDb from 'main/database/dmMaOnline';
import { LabParser } from './LabParser';

class Access2Transform extends Transform {
  // buffer [ENQ...EOT]
  buffer = Buffer.alloc(0);

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ) {
    const chunkLength = chunk.length;
    for (let i = 0; i < chunkLength; i++) {
      if (chunk[i] === ASCII_CODE.EOT) {
        // buffer [ENQ...]
        if (this.buffer[0] === ASCII_CODE.ENQ) this.push(this.buffer);
        this.buffer = Buffer.alloc(0);
      } else if (chunk[i] === ASCII_CODE.ENQ) {
        // buffer [ENQ]
        this.buffer = Buffer.from([ASCII_CODE.ENQ]);
      } else if (this.buffer[0] === ASCII_CODE.ENQ) {
        // buffer [ENQ...chunk[i]]
        this.buffer = Buffer.concat([this.buffer, Buffer.from([chunk[i]])]);
      }
    }
    callback();
  }
}

export class Access2Parser extends LabParser {
  init() {
    this.transform = new Access2Transform();
  }

  prepare(buffer: Buffer) {
    buffer.forEach((char) => {
      // Send ACK when ETX, ENQ or LF is received
      if ([ASCII_CODE.ETX, ASCII_CODE.ENQ, ASCII_CODE.LF].includes(char)) {
        this.connection.port.write(Buffer.from([ASCII_CODE.ACK]));
        this.connection.port.drain((error) => {
          if (error) console.log('Write port error', error);
        });
      }
    });
  }

  parse(buffer: Buffer) {
    const str = buffer
      .toString()
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '\n') // Use regex to match Control characters in Unicode and replace them with newline
      .replace(/^\s+|\s+$/g, '') // Remove leading and trailing whitespace
      .replace(/\r\n/g, '\n') // Replace "\r\n" with "\n"
      .replace(/\n{2,}/g, '\n'); // Remove duplicate newline characters

    const lines = str.split('\n');
    if (!lines || !lines.length || lines.length < 6) return;

    /**
     * Regex match `1H|\^&|||ACCESS^503884|||||LIS||P|1|20240330104322`
     */
    const regex = /^.*ACCESS.*(?<date_time>[0-9]{14})$/;
    if (!regex.test(lines[0])) return;

    let date_time = lines[0].match(regex)?.groups?.date_time;
    if (!date_time) return;
    date_time = parseString(date_time);

    /**
     * Regex match `2P|1|HOANG PHUONG`
     */
    const regex1 = /(?<person>[a-zA-Z0-9\s]+)$/;
    const person = lines[2].match(regex1)?.groups?.person;
    if (!person) return;

    /**
     * Regex match `3O|1|0012P|^1302^4|^^^HCG5^1|||||||||||Serum||||||||||F`
     */
    const regex2 = /(?<barcode>[0-9]{3,})[a-zA-Z0-9]*/;
    let barcode = lines[4].match(regex2)?.groups?.barcode;
    if (!barcode) return;
    barcode = barcode.padStart(4, '0'); // fill zero at start

    /**
     * Regex match `4R|1|^^^HCG5^1|342.22|mIU/mL||N||F||||20240330104401|503884`
     */
    const regex3 =
      /\^{3}(?<chiso>[a-zA-Z0-9-]+)\^[0-9]+\|(?<giatri>[>\-+]?[0-9.]+)\|/;
    const { chiso, giatri } = lines[6].match(regex3)?.groups || {};

    const result = {
      date_time,
      person,
      barcode,
      chiso,
      giatri,
    };
    return result;
  }

  save(data: any) {
    this.connection.logger.log('Save data for Access2', data);
    const chiso: any = dmMaOnlineDb.getByMa(LAB.Access2, data.chiso);
    if (!chiso) {
      this.connection.logger.log('Ma not found', data.chiso);
      return;
    }

    const values = {
      date_time: data.date_time,
      barcode: data.barcode,
      sendhis: 0,
      [chiso.ma]: data.giatri,
    };

    const params = {
      date_time: data.date_time,
      barcode: data.barcode,
    };
    let item: any = kqAccess2Db.query(params);
    if (item) {
      item = kqAccess2Db.update(item.id, values);
    } else {
      item = kqAccess2Db.create(values);
    }
    return item;
  }
}
