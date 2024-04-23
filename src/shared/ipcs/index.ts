import { ipcMain as IpcMain, ipcRenderer as IpcRenderer } from 'electron';
import { TypedIpcMain, TypedIpcRenderer } from 'electron-typed-ipc';
import { IpcChannels } from './types';
import type { IpcEvents, IpcCommands } from './types';

export { IpcEvents, IpcCommands, IpcChannels };

export const ipcMain = IpcMain as TypedIpcMain<IpcEvents, IpcCommands>;
export const ipcRenderer = IpcRenderer as TypedIpcRenderer<
  IpcEvents,
  IpcCommands
>;
