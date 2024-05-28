import { WindowIpcChannel, WindowIpcEvents, WindowIpcCommands } from './window';
import { StorageIpcChannel, StorageIpcEvents } from './storage';
import { LoggerIpcChannel, LoggerIpcEvents } from './logger';
import {
  ConnectionIpcChannel,
  ConnectionIpcEvents,
  ConnectionIpcCommands,
} from './connection';
import {
  SyncHisIpcChannel,
  SyncHisIpcEvents,
  SyncHisIpcCommands,
} from './syncHis';
import { LogSendIpcChannel, LogSendIpcCommands } from './logSend';
import { KqBW200IpcChannel, KqBW200IpcCommands } from './kqBW200';
import { KqAccess2IpcChannel, KqAccess2IpcCommands } from './kqAccess2';
import {
  KqSysmexXP100IpcChannel,
  KqSysmexXP100IpcCommands,
} from './kqSysmexXP100';
import {
  KqBioSystemA15IpcChannel,
  KqBioSystemA15IpcCommands,
} from './kqBioSystemA15';

export type IpcEvents = WindowIpcEvents &
  StorageIpcEvents &
  LoggerIpcEvents &
  ConnectionIpcEvents &
  SyncHisIpcEvents;

export type IpcCommands = WindowIpcCommands &
  ConnectionIpcCommands &
  SyncHisIpcCommands &
  LogSendIpcCommands &
  KqBW200IpcCommands &
  KqAccess2IpcCommands &
  KqSysmexXP100IpcCommands &
  KqBioSystemA15IpcCommands;

export const IpcChannel = {
  ...WindowIpcChannel,
  ...StorageIpcChannel,
  ...ConnectionIpcChannel,
  ...SyncHisIpcChannel,
  ...LoggerIpcChannel,
  ...LogSendIpcChannel,
  ...KqBW200IpcChannel,
  ...KqAccess2IpcChannel,
  ...KqSysmexXP100IpcChannel,
  ...KqBioSystemA15IpcChannel,
};
