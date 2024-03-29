import { combineIpcs } from 'interprocess';
import { counterIpcSlice } from './counter';

export const { ipcMain, ipcRenderer, exposeApiToGlobalWindow } =
  combineIpcs(counterIpcSlice);
