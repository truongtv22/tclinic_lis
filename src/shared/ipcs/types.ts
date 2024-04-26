import { WindowIpcChannel, WindowIpcEvents, WindowIpcCommands } from './window';
import { StorageIpcChannel, StorageIpcEvents } from './storage';
import {
  ConnectionIpcChannel,
  ConnectionIpcEvents,
  ConnectionIpcCommands,
} from './connection';
import { KqBW200IpcChannel, KqBW200IpcCommands } from './kqBW200';

export type IpcEvents = WindowIpcEvents &
  StorageIpcEvents &
  ConnectionIpcEvents;
export type EventChannel = keyof IpcEvents;
export type EventParam = IpcEvents[EventChannel];

export type IpcCommands = WindowIpcCommands &
  ConnectionIpcCommands &
  KqBW200IpcCommands;

export const IpcChannel = {
  ...WindowIpcChannel,
  ...StorageIpcChannel,
  ...ConnectionIpcChannel,
  ...KqBW200IpcChannel,
};
