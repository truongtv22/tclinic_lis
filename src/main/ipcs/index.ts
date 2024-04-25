import { registerWindowIpc } from './window';
import { registerStorageIpc } from './storage';
import { registerConnectionIpc } from './connection';

export const registerIpcs = () => {
  registerWindowIpc();
  registerStorageIpc();
  registerConnectionIpc();
};
 