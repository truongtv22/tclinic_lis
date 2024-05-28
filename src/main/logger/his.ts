import { app } from 'electron';
import path from 'path';
import Logger, { MainLogger } from 'electron-log';

class HisLogger {
  logger: MainLogger;

  constructor() {
    this.logger = Logger.create({ logId: 'his' });
    Object.assign(this, this.logger);
  }

  init() {
    this.logger.transports.file.resolvePathFn = () =>
      path.join(app.getPath('userData'), 'logs/his.log');
  }
}

export const hisLogger = new HisLogger() as typeof Logger & HisLogger;
