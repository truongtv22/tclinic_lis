import { app, shell, dialog } from 'electron';
import { ipcMain, IpcChannel } from 'shared/ipcs';
import { WINDOW_ID } from 'shared/constants';
import { windowManager } from '../window';
import { logManager } from '../logger';
import Log from 'electron-log/main';

export function registerWindowIpc() {
  ipcMain.on(IpcChannel.MAIN_WINDOW_RELOAD, (event) => {
    const window = windowManager.getWindow(WINDOW_ID.MAIN);
    if (window) window.reload();
  });

  ipcMain.on(IpcChannel.OPEN_VIEW_WINDOW, (event) => {
    // const windowLog = Log.create({ logId: 'window' });
    // windowLog.hooks.push((message, transport, transportName) => {
    //   console.log('windowLog->message', message, transport, transportName);
    //   return message;
    // })
    // windowLog.scope('open-view-window').log('open view window 2');
    // windowManager.createWindow(WINDOW_ID.VIEW);
    const data = logManager.scope('connection-1').getLog()
    console.log('data', data);
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
