import { ipcMain, IpcChannel } from 'shared/ipcs';
import { logManager } from '../logger';

export function registerLoggerIpc() {
  ipcMain.on(IpcChannel.GET_LOG, (event, scope) => {
    event.returnValue = logManager.scope(scope).getLogs();
  });

  ipcMain.on(IpcChannel.CLEAR_LOG, (event, scope) => {
    logManager.scope(scope).clear();
  });
}
