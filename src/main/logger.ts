import Log, { LogMessage } from 'electron-log';

class LogManager {
  logs: Record<string, LogMessage[]> = {};

  init() {
    Log.transports.console;
    Log.hooks.push((message, transport) => {
      if (transport === Log.transports.console) {
        if (message.scope && message.variables?.processType === 'main') {
          if (!this.logs[message.scope]) this.logs[message.scope] = [];
          this.logs[message.scope].push(message);
        }
      }
      return message;
    });
  }

  scope(scope: string) {
    const self = this;
    return Object.assign(Log.scope, {
      getLog() {
        return self.logs[scope];
      },

      clear() {
        delete self.logs[scope];
      },
    });
  }
}

export const logManager = new LogManager();
