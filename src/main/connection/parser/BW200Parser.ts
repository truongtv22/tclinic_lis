import { Transform, TransformCallback } from 'stream';
import { ASCII_CODE, LAB } from 'shared/constants';
import kqBW200Db from 'main/database/kqBW200';
import dmMaOnlineDb from 'main/database/dmMaOnline';
import { LabParser } from './LabParser';

class BW200Transform extends Transform {
  // buffer [STX...ETX]
  buffer = Buffer.alloc(0);

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ) {
    const chunkLength = chunk.length;
    for (let i = 0; i < chunkLength; i++) {
      if (chunk[i] === ASCII_CODE.ETX) {
        // buffer [STX...]
        if (this.buffer[0] === ASCII_CODE.STX) this.push(this.buffer);
        this.buffer = Buffer.alloc(0);
      } else if (chunk[i] === ASCII_CODE.STX) {
        // buffer [STX]
        this.buffer = Buffer.from([ASCII_CODE.STX]);
      } else if (this.buffer[0] === ASCII_CODE.STX) {
        // buffer [STX...chunk[i]]
        this.buffer = Buffer.concat([this.buffer, Buffer.from([chunk[i]])]);
      }
    }
    callback();
  }
}

export class BW200Parser extends LabParser {
  init() {
    this.transform = new BW200Transform();
  }

  prepare(buffer: Buffer) {}

  parse(buffer: Buffer) {
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
    let barcode = lines[0].match(regex)?.groups?.barcode; // BIOWAY B-11  001-001
    if (!barcode) return;
    barcode = barcode.padStart(4, '0'); // fill zero at start

    const result: any = {
      date_time: new Date().toISOString(),
      barcode,
    };

    // Extract other indexes
    for (let i = 1; i < lines.length; i++) {
      /**
       * Extract index and value
       * `URO -`
       * `SG  1.015`
       * `VC  +-`
       */
      const regex1 = /(?<chiso>[A-Z]+)\s*(?<giatri>[.\S]*)\s*/i;
      const found = lines[i].match(regex1);
      if (found) {
        let { chiso, giatri } = found.groups;
        if (giatri === '-') giatri = 'Âm tính';
        if (giatri === '+-') giatri = '+Âm tính';
        result[chiso] = giatri;
      }
    }

    return result;
  }

  save(data: any) {
    this.connection.logger.log('Save data for BW200', data);
    const values: any = {
      date_time: data.date_time,
      barcode: data.barcode,
    };

    const dmChiso: any = dmMaOnlineDb.getByLab(LAB.BW200);
    if (dmChiso) {
      for (const chiso of dmChiso) {
        if (chiso.ma_online in data) {
          values[chiso.ma] = data[chiso.ma_online];
        }
      }
    }
    
    const item = kqBW200Db.create(values);
    this.connection.logger.log('Save data for BW200 successfully', item);
    return item;
  }
}
