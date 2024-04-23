import { registerWindowIpc } from './window';
import { registerStorageIpc } from './storage';

export const registerIpcs = () => {
  registerWindowIpc();
  registerStorageIpc();
};
