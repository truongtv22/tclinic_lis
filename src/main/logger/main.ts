import { app } from 'electron';
import path from 'path';
import Log from 'electron-log';

import { hisLogger } from './his';
import { logManager } from './manager';

export function configureLogger() {
  Log.initialize();
  Log.transports.file.resolvePathFn = () =>
    path.join(app.getPath('userData'), 'logs/main.log');
  // Object.assign(console, Log.functions);

  hisLogger.init();
  logManager.init();
}
