import { ipcMain, IpcChannel } from 'shared/ipcs';
import kqAccess2Service from 'main/services/kqAccess2';

export function registerKqAccess2Ipc() {
  ipcMain.handle(IpcChannel.GET_KQ_ACCESS2, (_, params) => {
    return kqAccess2Service.getAll(params);
  });
  ipcMain.handle(IpcChannel.CREATE_KQ_ACCESS2, () => {});
  ipcMain.handle(IpcChannel.UPDATE_KQ_ACCESS2, () => {});
  ipcMain.handle(IpcChannel.DELETE_KQ_ACCESS2, () => {});
  ipcMain.handle(IpcChannel.SEND_HIS_KQ_ACCESS2, (_, id, data) => {});
}
