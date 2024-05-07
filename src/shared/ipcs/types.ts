import { WindowIpcChannel, WindowIpcEvents, WindowIpcCommands } from './window';
import { StorageIpcChannel, StorageIpcEvents } from './storage';
import {
  ConnectionIpcChannel,
  ConnectionIpcEvents,
  ConnectionIpcCommands,
} from './connection';
import { KqBW200IpcChannel, KqBW200IpcCommands } from './kqBW200';
import { LoggerIpcChannel, LoggerIpcEvents } from './logger';

export type IpcEvents = WindowIpcEvents &
  StorageIpcEvents &
  LoggerIpcEvents &
  ConnectionIpcEvents;

export type IpcCommands = WindowIpcCommands &
  ConnectionIpcCommands &
  KqBW200IpcCommands;

export const IpcChannel = {
  ...WindowIpcChannel,
  ...StorageIpcChannel,
  ...ConnectionIpcChannel,
  ...LoggerIpcChannel,
  ...KqBW200IpcChannel,
};
