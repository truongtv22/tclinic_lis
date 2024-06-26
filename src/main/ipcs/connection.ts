import Log from 'electron-log';
import { ipcMain, IpcChannel } from 'shared/ipcs';
import connectionService from 'main/services/connection';
import { connectionManager } from 'main/connection';

export function registerConnectionIpc() {
  const logger = Log.scope('connectionIpc');

  // Initialize connection manager
  connectionManager.init();

  // Listen open/close connection
  ipcMain.on(IpcChannel.OPEN_CONNECTION, (_, id) => {
    logger.log(`Send action open connection ${id}`);
    connectionManager.openConnection(id);
  });

  ipcMain.on(IpcChannel.CLOSE_CONNECTION, (_, id) => {
    console.log(`Send action close connection ${id}`);
    connectionManager.closeConnection(id);
  });

  // Handle manage connection
  ipcMain.handle(IpcChannel.GET_ALL_CONNECTION, () => {
    return connectionService.getAll();
  });

  ipcMain.handle(IpcChannel.GET_ALL_CONNECTION_STATUS, () => {
    return connectionService.getAllStatus();
  });

  ipcMain.handle(IpcChannel.GET_CONNECTION, (_, id) => {
    return connectionService.getById(id);
  });

  ipcMain.handle(IpcChannel.CREATE_CONNECTION, (_, data) => {
    return connectionService.create(data);
  });

  ipcMain.handle(IpcChannel.UPDATE_CONNECTION, (_, id, data) => {
    return connectionService.update(id, data);
  });

  ipcMain.handle(IpcChannel.DELETE_CONNECTION, (_, id) => {
    return connectionService.delete(id);
  });
}
