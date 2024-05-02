import { Transform } from 'stream';
import { Connection } from '../index';

export class LabParser {
  transform: Transform;
  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
    this.init();
    this.setup();
  }

  /**
   * Initializes the transform before setup
   */
  init() {}

  /**
   * Sets up the connection and transform to pipe data between them
   */
  setup() {
    this.connection.port.pipe(this.transform);

    this.connection.port.on('data', (buffer: Buffer) => {
      console.log('Prepare data from port to parser', this.connection.id);
      this.prepare(buffer);
    });

    this.transform.on('data', (buffer: Buffer) => {
      console.log('Parse data from parser', this.connection.id);
      const data = this.parse(buffer);
      console.log('Save data from parser', this.connection.id);
      if (data) this.save(data);
    });
  }

  /**
   * Prepares the given buffer for further processing
   *
   * @param {Buffer} buffer - The buffer to be prepared
   */
  prepare(buffer: Buffer) {}

  /**
   * Parses the given buffer and returns the result
   *
   * @param {Buffer} buffer - The buffer to be parsed
   * @return {any} The parsed result
   */
  parse(buffer: Buffer): any {}

  /**
   * Saves the given data
   *
   * @param {any} data - The data to be saved
   */
  save(data: any) {}

  /**
   * Destroys the parser of the connection
   */
  destroy() {
    console.log('Destroy parser', this.connection.id);
  }
}
