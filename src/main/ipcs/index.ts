import { BrowserWindow } from 'electron';
import { initWindowIpc } from './window';

export const initIpcs = (
  mainWindow: BrowserWindow | null,
  viewWindow: BrowserWindow | null,
) => {
  initWindowIpc(mainWindow, viewWindow);
};
