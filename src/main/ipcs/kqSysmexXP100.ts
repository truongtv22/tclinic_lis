import { ipcMain, IpcChannel } from 'shared/ipcs';
import kqSysmexXP100Service from 'main/services/kqSysmexXP100';

export function registerKqSysmexXP100Ipc() {
  ipcMain.handle(IpcChannel.GET_KQ_SYSMEX_XP100, (_, params) => {
    return kqSysmexXP100Service.getAll(params);
  });
  ipcMain.handle(IpcChannel.CREATE_KQ_SYSMEX_XP100, (_, data) => {
    return kqSysmexXP100Service.create(data);
  });
  ipcMain.handle(IpcChannel.UPDATE_KQ_SYSMEX_XP100, (_, id, data) => {
    return kqSysmexXP100Service.update(id, data);
  });
  ipcMain.handle(IpcChannel.DELETE_KQ_SYSMEX_XP100, (_, id) => {
    return kqSysmexXP100Service.delete(id);
  });
}
