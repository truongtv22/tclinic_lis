// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { preloadReduxBridge } from 'reduxtron/preload';

import type { State, Action } from '../shared/reducers';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send(channel: string, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    invoke: async (channel: string, ...args: any[]) => {
      const result = await ipcRenderer.invoke(channel, ...args);
      return result;
    },
  },
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
    connect: (params: any) => {
      ipcRenderer.send('serialport-connect', params);
    },
    disconnect: () => {
      ipcRenderer.send('serialport-disconnect');
    },
    on: (event: any, listener: (...args: unknown[]) => void) => {
      const subscription = (_event: any, ...args: unknown[]) =>
        listener(...args);
      ipcRenderer.on(`serialport-${event}`, subscription);
      return () => {
        ipcRenderer.removeListener(`serialport-${event}`, subscription);
      };
    },
    once: (event: any, listener: (...args: unknown[]) => void) => {
      ipcRenderer.once(event, (_event, ...args) => listener(...args));
    },
  },
});

contextBridge.exposeInMainWorld('dbApi', {
  getConnect: async () => {
    return ipcRenderer.invoke('connectmanage-get');
  },
  createConnect: async (values: any) => {
    return ipcRenderer.invoke('connectmanage-create', values);
  },
  updateConnect: async (values: any) => {
    return ipcRenderer.invoke('connectmanage-update', values);
  },
  deleteConnect: async (id: any) => {
    return ipcRenderer.invoke('connectmanage-delete', id);
  },
});

const { handlers } = preloadReduxBridge<Partial<State>, Action>(ipcRenderer);

contextBridge.exposeInMainWorld('reduxtron', handlers);
