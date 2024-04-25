import { ipcMain, IpcChannel } from 'shared/ipcs';
import { WINDOW_ID } from 'shared/constants';
import { windowManager } from '../window';

export function registerWindowIpc() {
  ipcMain.on(IpcChannel.MAIN_WINDOW_RELOAD, (event) => {
    const window = windowManager.getWindow(WINDOW_ID.MAIN);
    if (window) window.reload();
  });

  ipcMain.on(IpcChannel.OPEN_VIEW_WINDOW, (event) => {
    windowManager.createWindow(WINDOW_ID.VIEW);
  });
}
