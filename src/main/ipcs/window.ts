import { app, shell, dialog, BrowserWindow } from 'electron';
import { ipcMain, IpcChannel } from 'shared/ipcs';
import { WINDOW_ID } from 'shared/constants';
import { windowManager, Window } from '../window';
import { logManager } from '../logger';

export function registerWindowIpc() {
  let viewWindow: Window | null = null;

  ipcMain.on(IpcChannel.MAIN_WINDOW_RELOAD, (event) => {
    const mainWindow = windowManager.getWindow(WINDOW_ID.MAIN);
    if (mainWindow) mainWindow.reload();
  });

  ipcMain.on(IpcChannel.OPEN_VIEW_WINDOW, (event, connectId: number) => {
    viewWindow = windowManager.getWindow(WINDOW_ID.VIEW);
    if (viewWindow) {
      viewWindow.update({ connectId });
      viewWindow.loadPage();
      viewWindow.show();
    } else {
      viewWindow = windowManager.createWindow(WINDOW_ID.VIEW, { connectId });
    }
    // viewWindow = windowManager.createWindow(WINDOW_ID.VIEW, { connectId });
    // const logs = logManager.scope(`connection-${connectId}`).getLogs()
    // console.log('logs', logs);
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
