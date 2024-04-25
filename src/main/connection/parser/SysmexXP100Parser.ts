import { Transform, TransformCallback } from 'stream';
import { LabParser, ASCII_CODE } from './LabParser';

class SysmexXP100Transform extends Transform {
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

export class SysmexXP100Parser extends LabParser {
  transform = new SysmexXP100Transform();

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
    if (!lines || !lines.length) return;

    /**
     * Regex match `1H|\^&|||XP-100^00-11^^^^A4941^BS649542||||||||E1394-97`
     */
    const regex = /^.*XP-100.*$/;
    if (!regex.test(lines[0])) return;

    /**
     * Regex match `3O|1||^^ 0001^A`
     */
    const regex1 = /\^{2}\s*(?<barcode>[0-9]{3,})\^/;
    let barcode = lines[4].match(regex1)?.groups?.barcode;
    if (!barcode) return;
    barcode = barcode.padStart(4, '0'); // fill zero at start

    const result: any = {
      date_time: new Date().toISOString(),
    };
    result.barcode = barcode;

    // Extract other indexes
    for (let i = 5; i < lines.length; i++) {
      /**
       * Extract index and value
       * `4R|1|^^^^WBC^1|  0,2|10*9/L||N||||               ||20240330150404`
       */
      const regex2 =
        /\^{4}(?<chiso>[a-zA-Z-%#]*)\^.\|\s*(?<giatri>[0-9.,*+-]*)/i;
      const found = lines[i].match(regex2);
      if (found) {
        let { chiso, giatri } = found.groups;
        result[chiso] = giatri;
      }
    }

    return result;
  }

  save(data: any) {
    console.log('SysmexXP100Parser', data);
  }
}
