import { BrowserWindow } from 'electron';
import { ipcMain, IpcChannels } from 'shared/ipcs';
import { createViewWindow } from '../window';

export function initWindowIpc(
  mainWindow: BrowserWindow | null,
  viewWindow: BrowserWindow | null,
) {
  ipcMain.on(IpcChannels.MAIN_WINDOW_RELOAD, (event) => {
    mainWindow?.reload();
  });

  ipcMain.on(IpcChannels.OPEN_VIEW_WINDOW, (event) => {
    if (viewWindow) {
      viewWindow.focus();
      return;
    }

    viewWindow = createViewWindow();
    viewWindow.on('close', () => {
      viewWindow = null;
    });
  });
}
