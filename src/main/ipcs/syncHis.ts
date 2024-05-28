import { ipcMain, IpcChannel } from 'shared/ipcs';
import syncHisService from 'main/services/syncHis';

export function registerSyncHisIpc() {
  ipcMain.handle(IpcChannel.SEND_HIS, (_, connectId, id, data) => {
    return syncHisService.sendHis(connectId, id, data);
  });
  ipcMain.handle(IpcChannel.CANCEL_HIS, (_, connectId, id, data) => {
    return syncHisService.cancelHis(connectId, id, data);
  });
}
