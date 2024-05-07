// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from 'electron';

import { ipcRenderer } from 'shared/ipcs';
import type { IpcEvents, IpcCommands } from 'shared/ipcs';

export const electronAPI = {
  ipcRenderer: {
    ...ipcRenderer,
    on<K extends keyof IpcEvents>(
      channel: K,
      func: (...args: Parameters<IpcEvents[K]>) => void,
    ) {
      const listener = (_: any, ...args: Parameters<IpcEvents[K]>) =>
        func(...args);
      ipcRenderer.on(channel, listener);
      return () => {
        ipcRenderer.removeListener(channel, listener);
      };
    },
    once<K extends keyof IpcEvents>(
      channel: K,
      func: (...args: Parameters<IpcEvents[K]>) => void,
    ) {
      const listener = (_: any, ...args: Parameters<IpcEvents[K]>) =>
        func(...args);
      ipcRenderer.once(channel, listener);
      return () => {
        ipcRenderer.removeListener(channel, listener);
      };
    },
    invoke<K extends keyof IpcCommands>(
      channel: K,
      ...args: Parameters<IpcCommands[K]>
    ) {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};
export type ElectronAPI = typeof electronAPI;

// ipcRenderer.on('__ELECTRON_LOG_IPC__', (_, message) => {
//   console.log('ELECTRON_LOG_IPC', message);
// });

contextBridge.exposeInMainWorld('electron', electronAPI);
