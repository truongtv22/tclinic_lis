// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from 'electron';

import { ipcRenderer } from 'shared/ipcs';
import type { IpcEvents, IpcCommands } from 'shared/ipcs';

const ipcHandler = {
  response: {
    onSuccess: (result: any, chanel: any, ...args: any) => {},
    onError: (error: any, chanel: any, ...args: any) => {},
  },
};
type IpcHandler = typeof ipcHandler;

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

    async invoke<K extends keyof IpcCommands>(
      channel: K,
      ...args: Parameters<IpcCommands[K]>
    ): Promise<ReturnType<IpcCommands[K]>> {
      try {
        const result = await ipcRenderer.invoke(channel, ...args);
        ipcHandler.response.onSuccess(result, channel, [...args]);
        return result;
      } catch (error) {
        ipcHandler.response.onError(error, channel, [...args]);
        throw error;
      }
    },

    onResponse(
      onSuccess: IpcHandler['response']['onSuccess'],
      onError: IpcHandler['response']['onError'],
    ) {
      ipcHandler.response.onSuccess = onSuccess;
      ipcHandler.response.onError = onError;
    },
  },
};
export type ElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electron', electronAPI);
