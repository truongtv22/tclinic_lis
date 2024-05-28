import { ipcMain, IpcChannel } from 'shared/ipcs';
import kqBioSystemA15Service from 'main/services/kqBioSystemA15';

export function registerKqBioSystemA15Ipc() {
  ipcMain.handle(IpcChannel.GET_KQ_BIOSYSTEM_A15, (_, params) => {
    return kqBioSystemA15Service.getAll(params);
  });
  ipcMain.handle(IpcChannel.CREATE_KQ_BIOSYSTEM_A15, (_, data) => {
    return kqBioSystemA15Service.create(data);
  });
  ipcMain.handle(IpcChannel.UPDATE_KQ_BIOSYSTEM_A15, (_, id, data) => {
    return kqBioSystemA15Service.update(id, data);
  });
  ipcMain.handle(IpcChannel.DELETE_KQ_BIOSYSTEM_A15, (_, id) => {
    return kqBioSystemA15Service.delete(id);
  });
}
