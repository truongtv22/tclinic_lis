import { ipcMain as IpcMain, ipcRenderer as IpcRenderer } from 'electron';
import {
  TypedIpcMain,
  TypedIpcRenderer,
  TypedWebContents,
} from 'electron-typed-ipc';
import { IpcChannel } from './types';
import type { IpcEvents, IpcCommands } from './types';

export { IpcEvents, IpcCommands, IpcChannel };

export const ipcMain = IpcMain as TypedIpcMain<IpcEvents, IpcCommands>;
export const ipcRenderer = IpcRenderer as TypedIpcRenderer<
  IpcEvents,
  IpcCommands
>;

export type WebContents = TypedWebContents<IpcEvents>;
