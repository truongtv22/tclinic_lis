import { IpcChannel } from 'shared/ipcs/types';

export function createElectronStorage() {
  return {
    getItem: (key: string) => {
      return new Promise((resolve) => {
        resolve(
          window.electron.ipcRenderer.sendSync(
            IpcChannel.STORAGE_GET_ITEM,
            key,
          ),
        );
      });
    },
    setItem: (key: string, item: any) => {
      return new Promise((resolve) => {
        resolve(
          window.electron.ipcRenderer.send(
            IpcChannel.STORAGE_SET_ITEM,
            key,
            item,
          ),
        );
      });
    },
    removeItem: (key: string) => {
      return new Promise((resolve) => {
        resolve(
          window.electron.ipcRenderer.send(
            IpcChannel.STORAGE_REMOVE_ITEM,
            key,
          ),
        );
      });
    },
  };
}
