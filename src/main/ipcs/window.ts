import { BrowserWindow, ipcMain } from 'electron';

export function initWindowIpc(mainWindow: BrowserWindow | null) {
  ipcMain.on('main-window-reload', (event) => {
    mainWindow?.reload();
  });

  ipcMain.on('open-view-window', (event) => {
    // openViewWindow();
  });
}
