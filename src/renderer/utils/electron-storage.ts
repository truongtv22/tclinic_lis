import { IpcChannels } from 'shared/ipcs/types';

export function createElectronStorage() {
  return {
    getItem: (key: string) => {
      console.log('createElectronStorage->getItem', key);
      return new Promise((resolve) => {
        resolve(
          window.electron.ipcRenderer.sendSync(
            IpcChannels.STORAGE_GET_ITEM,
            key,
          ),
        );
      });
    },
    setItem: (key: string, item: any) => {
      console.log('createElectronStorage->setItem', key, item);
      return new Promise((resolve) => {
        resolve(
          window.electron.ipcRenderer.send(
            IpcChannels.STORAGE_SET_ITEM,
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
            IpcChannels.STORAGE_REMOVE_ITEM,
            key,
          ),
        );
      });
    },
  };
}
