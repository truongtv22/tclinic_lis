import { ipcMain, IpcChannel } from 'shared/ipcs';
import logSendService from 'main/services/logSend';

export function registerLogSendIpc() {
  ipcMain.handle(IpcChannel.GET_LOG_SEND, (_, params) => {
    return logSendService.getAll(params);
  });
}
