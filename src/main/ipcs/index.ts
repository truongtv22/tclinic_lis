import { registerWindowIpc } from './window';
import { registerStorageIpc } from './storage';
import { registerLoggerIpc } from './logger';
import { registerConnectionIpc } from './connection';
import { registerKqBW200Ipc } from './kqBW200';
import { registerKqAccess2Ipc } from './kqAccess2';
import { registerKqSysmexXP100Ipc } from './kqSysmexXP100';

export const registerIpcs = () => {
  registerWindowIpc();
  registerStorageIpc();
  registerLoggerIpc();
  registerConnectionIpc();
  registerKqBW200Ipc();
  registerKqAccess2Ipc();
  registerKqSysmexXP100Ipc();
};
