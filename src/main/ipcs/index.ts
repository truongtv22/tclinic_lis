import { registerWindowIpc } from './window';
import { registerStorageIpc } from './storage';
import { registerKqBW200Ipc } from './kqBW200';
import { registerConnectionIpc } from './connection';

export const registerIpcs = () => {
  registerWindowIpc();
  registerStorageIpc();
  registerKqBW200Ipc();
  registerConnectionIpc();
};
 