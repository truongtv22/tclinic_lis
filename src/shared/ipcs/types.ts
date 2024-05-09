import { WindowIpcChannel, WindowIpcEvents, WindowIpcCommands } from './window';
import { StorageIpcChannel, StorageIpcEvents } from './storage';
import { LoggerIpcChannel, LoggerIpcEvents } from './logger';
import {
  ConnectionIpcChannel,
  ConnectionIpcEvents,
  ConnectionIpcCommands,
} from './connection';
import { KqBW200IpcChannel, KqBW200IpcCommands } from './kqBW200';
import { KqAccess2IpcChannel, KqAccess2IpcCommands } from './kqAccess2';
import {
  KqSysmexXP100IpcChannel,
  KqSysmexXP100IpcCommands,
} from './kqSysmexXP100';

export type IpcEvents = WindowIpcEvents &
  StorageIpcEvents &
  LoggerIpcEvents &
  ConnectionIpcEvents;

export type IpcCommands = WindowIpcCommands &
  ConnectionIpcCommands &
  KqBW200IpcCommands &
  KqAccess2IpcCommands &
  KqSysmexXP100IpcCommands;

export const IpcChannel = {
  ...WindowIpcChannel,
  ...StorageIpcChannel,
  ...ConnectionIpcChannel,
  ...LoggerIpcChannel,
  ...KqBW200IpcChannel,
  ...KqAccess2IpcChannel,
  ...KqSysmexXP100IpcChannel,
};
