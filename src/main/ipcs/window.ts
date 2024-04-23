import { ipcMain, IpcChannels } from 'shared/ipcs';
import { WINDOW_ID } from 'shared/constants/window';
import { windowManager } from '../window/manager';

export function registerWindowIpc() {
  ipcMain.on(IpcChannels.MAIN_WINDOW_RELOAD, (event) => {
    const window = windowManager.getWindow(WINDOW_ID.MAIN);
    if (window) window.reload();
  });

  ipcMain.on(IpcChannels.OPEN_VIEW_WINDOW, (event) => {
    windowManager.createWindow(WINDOW_ID.VIEW);
  });
}
