// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from 'electron';
import { preloadReduxBridge } from 'reduxtron/preload';

import { ipcRenderer } from 'shared/ipcs';
import type { IpcEvents, IpcCommands } from 'shared/ipcs';
import type { State, Action } from 'shared/reducers';

export const electronAPI = {
  ipcRenderer,
  // ipcRenderer: {
  //   send(channel: keyof IpcEvents, ...args: Parameters<IpcEvents[keyof IpcEvents]>) {
  //     ipcRenderer.send(channel, ...args);
  //   },
  //   invoke: async (channel: string, ...args: any[]) => {
  //     return ipcRenderer.invoke(channel, ...args);
  //   },
  //   on(channel: string, func: (...args: any[]) => void) {
  //     const listener = (_event: any, ...args: any[]) => func(...args);
  //     ipcRenderer.on(channel, listener);
  //     return () => {
  //       ipcRenderer.removeListener(channel, listener);
  //     };
  //   },
  //   once(channel: string, func: (...args: any[]) => void) {
  //     const listener = (_event: any, ...args: any[]) => func(...args);
  //     ipcRenderer.once(channel, listener);
  //     return () => {
  //       ipcRenderer.removeListener(channel, listener);
  //     };
  //   },
  //   removeListener(channel: string, listener: () => void) {
  //     ipcRenderer.removeListener(channel, listener);
  //   },
  //   removeAllListeners(channel: string) {
  //     ipcRenderer.removeAllListeners(channel);
  //   },
  // },
};

export type ElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electron', electronAPI);

const { handlers } = preloadReduxBridge<Partial<State>, Action>(ipcRenderer);
contextBridge.exposeInMainWorld('reduxtron', handlers);
