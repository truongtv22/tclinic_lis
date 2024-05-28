import { ipcMain, IpcChannel } from 'shared/ipcs';
import kqBW200Service from 'main/services/kqBW200';

export function registerKqBW200Ipc() {
  ipcMain.handle(IpcChannel.GET_KQ_BW200, (_, params) => {
    return kqBW200Service.getAll(params);
  });
  ipcMain.handle(IpcChannel.CREATE_KQ_BW200, (_, data) => {
    return kqBW200Service.create(data);
  });
  ipcMain.handle(IpcChannel.UPDATE_KQ_BW200, (_, id, data) => {
    return kqBW200Service.update(id, data);
  });
  ipcMain.handle(IpcChannel.DELETE_KQ_BW200, (_, id) => {
    return kqBW200Service.delete(id);
  });
}
