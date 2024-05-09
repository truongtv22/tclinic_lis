// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from 'electron';

import { ipcRenderer } from 'shared/ipcs';
import type { IpcEvents, IpcCommands } from 'shared/ipcs';

const ipcHandler = {
  request: {
    onSuccess: () => {},
    onError: (error: any) => {},
  },
  response: {
    onSuccess: () => {},
    onError: (error: any) => {},
  },
};

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
    ): Promise<ReturnType<IpcCommands[K]>> {
      try {
        ipcHandler.request.onSuccess();
      } catch (error) {
        ipcHandler.request.onError(error);
      }

      try {
        const result = ipcRenderer.invoke(channel, ...args);
        ipcHandler.response.onSuccess();
        return result;
      } catch (error) {
        ipcHandler.response.onError(error);
        throw error;
      }
    },

    onRequest(onSuccess: () => void, onError: (error: any) => void) {
      ipcHandler.request.onSuccess = onSuccess;
      ipcHandler.request.onError = onError;
    },

    onResponse(onSuccess: () => void, onError: (error: any) => void) {
      ipcHandler.response.onSuccess = onSuccess;
      ipcHandler.response.onError = onError;
    },
  },
};
export type ElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electron', electronAPI);
