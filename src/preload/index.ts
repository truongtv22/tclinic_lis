// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from 'electron';
import { preloadReduxBridge } from 'reduxtron/preload';

import { ipcRenderer } from 'shared/ipcs';
import type { IpcEvents } from 'shared/ipcs';
import type { State, Action } from 'shared/store/types';

type Channel = keyof IpcEvents;
type EventParams = IpcEvents[Channel];

export const electronAPI = {
  ipcRenderer: {
    ...ipcRenderer,
    on(channel: Channel, func: (...args: Parameters<EventParams>) => void) {
      const listener = (_: any, ...args: Parameters<EventParams>) =>
        func(...args);
      ipcRenderer.on(channel, listener);
      return () => {
        ipcRenderer.removeListener(channel, listener);
      };
    },
    once(channel: Channel, func: (...args: Parameters<EventParams>) => void) {
      const listener = (_: any, ...args: Parameters<EventParams>) =>
        func(...args);
      ipcRenderer.once(channel, listener);
      return () => {
        ipcRenderer.removeListener(channel, listener);
      };
    },
  },
};

export type ElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electron', electronAPI);

const { handlers } = preloadReduxBridge<Partial<State>, Action>(ipcRenderer);
contextBridge.exposeInMainWorld('reduxtron', handlers);
