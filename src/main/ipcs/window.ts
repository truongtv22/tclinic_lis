import { app, shell, dialog } from 'electron';
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

  ipcMain.on(IpcChannel.OPEN_APP_FOLDER, (event) => {
    shell.showItemInFolder(app.getPath('userData'));
  });

  ipcMain.handle(IpcChannel.SELECT_FOLDER, async (event) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    const folderPath = filePaths[0];
    return { folderPath, canceled };
  });
}
