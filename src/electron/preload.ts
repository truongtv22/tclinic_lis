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
  serialport: {
    connect: (options) => {
      ipcRenderer.send('serialport-connect', options);
    },
    disconnect: () => {
      ipcRenderer.send('serialport-disconnect');
    },
  },
});

document.addEventListener('DOMContentLoaded', async () => {
  ipcRenderer.on('serialport-data', (event, data) => {
    console.log('serialport-data', data);
  });
});
