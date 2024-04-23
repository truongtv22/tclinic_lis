import { WindowIpcChannels, WindowIpcEvents } from './window';
import { StorageIpcChannels, StorageIpcEvents } from './storage';

export type IpcEvents = WindowIpcEvents & StorageIpcEvents;

export type IpcCommands = {};

export const IpcChannels = {
  ...WindowIpcChannels,
  ...StorageIpcChannels,
};
