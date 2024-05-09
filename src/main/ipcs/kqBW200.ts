import { ipcMain, IpcChannel } from 'shared/ipcs';
import kqBW200Service from 'main/services/kqBW200';

export function registerKqBW200Ipc() {
  ipcMain.handle(IpcChannel.GET_KQ_BW200, (_, params) => {
    return kqBW200Service.getAll(params);
  });
  ipcMain.handle(IpcChannel.CREATE_KQ_BW200, () => {});
  ipcMain.handle(IpcChannel.UPDATE_KQ_BW200, () => {});
  ipcMain.handle(IpcChannel.DELETE_KQ_BW200, () => {});
  ipcMain.handle(IpcChannel.SEND_HIS_KQ_BW200, (_, id, data) => {
    return kqBW200Service.sendHis(id, data);
  });
}
