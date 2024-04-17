// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { preloadReduxBridge } from 'reduxtron/preload';

import type { State, Action } from 'shared/reducers';

const electronAPI = {
  ipcRenderer: {
    send(channel: string, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    invoke: async (channel: string, ...args: any[]) => {
      return ipcRenderer.invoke(channel, ...args);
    },
    on(channel: string, func: (...args: any[]) => void) {
      const listener = (_event: any, ...args: any[]) => func(...args);
      ipcRenderer.on(channel, listener);
      return () => {
        ipcRenderer.removeListener(channel, listener);
      };
    },
    once(channel: string, func: (...args: any[]) => void) {
      const listener = (_event: any, ...args: any[]) => func(...args);
      ipcRenderer.once(channel, listener);
      return () => {
        ipcRenderer.removeListener(channel, listener);
      };
    },
    removeListener(channel: string, listener: () => void) {
      ipcRenderer.removeListener(channel, listener);
    },
    removeAllListeners(channel: string) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
};

contextBridge.exposeInMainWorld('electron', {
  ...electronAPI,
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

  getKqBW200: async (params?: any) => {
    return ipcRenderer.invoke('kqBW200-get', params);
  },
});

const { handlers } = preloadReduxBridge<Partial<State>, Action>(ipcRenderer);
contextBridge.exposeInMainWorld('reduxtron', handlers);
