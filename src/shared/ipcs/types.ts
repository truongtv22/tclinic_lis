import { WindowIpcChannel, WindowIpcEvents } from './window';
import { StorageIpcChannel, StorageIpcEvents } from './storage';
import {
  ConnectionIpcChannel,
  ConnectionIpcEvents,
  ConnectionIpcCommands,
} from './connection';

export type IpcEvents = WindowIpcEvents &
  StorageIpcEvents &
  ConnectionIpcEvents;
export type EventChannel = keyof IpcEvents;
export type EventParam = IpcEvents[EventChannel];

export type IpcCommands = ConnectionIpcCommands;

export const IpcChannel = {
  ...WindowIpcChannel,
  ...StorageIpcChannel,
  ...ConnectionIpcChannel,
};
