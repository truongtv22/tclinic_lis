import Storage from 'electron-store';
import { ipcMain, IpcChannel } from 'shared/ipcs';

export function registerStorageIpc() {
  const storage = new Storage();

  ipcMain.on(IpcChannel.STORAGE_GET_ITEM, (event, key) => {
    event.returnValue = storage.get(key);
  });

  ipcMain.on(IpcChannel.STORAGE_SET_ITEM, (event, key, value) => {
    storage.set(key, value);
  });

  ipcMain.on(IpcChannel.STORAGE_REMOVE_ITEM, (event, key) => {
    storage.delete(key);
  });
}
