// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  store: {
    get(key: string) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(key: string, value: any) {
      ipcRenderer.send('electron-store-set', key, value);
    },
    delete(key: string) {
      ipcRenderer.send('electron-store-delete', key);
    },
  },
});
