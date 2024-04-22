import { ipcMain as IpcMain, ipcRenderer as IpcRenderer } from 'electron';
import { TypedIpcMain, TypedIpcRenderer } from 'electron-typed-ipc';

import { WindowIpcChannels, WindowIpcEvents } from './window';
import { StorageIpcChannels } from './storage';

export type IpcEvents = WindowIpcEvents;

export type IpcCommands = {};

export const IpcChannels = {
  ...WindowIpcChannels,
  ...StorageIpcChannels,
};

export const ipcMain = IpcMain as TypedIpcMain<IpcEvents, IpcCommands>;
export const ipcRenderer = IpcRenderer as TypedIpcRenderer<
  IpcEvents,
  IpcCommands
>;
