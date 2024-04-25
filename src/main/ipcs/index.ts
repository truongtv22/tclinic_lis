import { registerWindowIpc } from './window';
import { registerStorageIpc } from './storage';

export const registerIpcs = (store) => {
  registerWindowIpc(store);
  registerStorageIpc();
};
