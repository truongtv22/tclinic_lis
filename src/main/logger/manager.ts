import Logger, { LogMessage } from 'electron-log';
import { WINDOW_ID } from 'shared/constants';
import { IpcChannel } from 'shared/ipcs';
import { windowManager } from '../window';

class LogManager {
  logs: Record<string, LogMessage[]> = {};

  init() {
    Logger.hooks.push((message, transport) => {
      if (transport === Logger.transports.console) {
        if (
          message.scope &&
          message.scope.includes('connection-') &&
          message.variables?.processType === 'main'
        ) {
          if (!this.logs[message.scope]) this.logs[message.scope] = [];
          this.logs[message.scope].unshift(message);

          const window = windowManager.getWindow(WINDOW_ID.VIEW);
          if (window) {
            window.webContents?.send(
              IpcChannel.LOG_CHANGED,
              message.scope,
              message,
            );
          }
        }
      }
      return message;
    });
  }

  scope(scope: string) {
    const self = this;
    const scopeInstance = Logger.scope(scope);
    return Object.assign(scopeInstance, {
      getLogs() {
        return self.logs[scope];
      },

      clear() {
        delete self.logs[scope];
      },
    });
  }
}

export const logManager = new LogManager();
