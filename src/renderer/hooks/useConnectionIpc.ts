import { useDispatch } from 'react-redux';
import { IpcChannel } from 'shared/ipcs/types';
import { connectionActions } from 'renderer/store/connection';
import { useIpcListener } from './useIpcListener';

export const useConnectionIpc = () => {
  const dispatch = useDispatch();

  const openConnection = (id: number) => {
    console.log('openConnection', id);
    window.electron.ipcRenderer.send(IpcChannel.OPEN_CONNECTION, id);
  }

  const closeConnection = (id: number) => {
    window.electron.ipcRenderer.send(IpcChannel.CLOSE_CONNECTION, id);
  }

  useIpcListener(IpcChannel.CONNECTION_OPENED, (id) => {
    console.log(`Connection ${id} opened`);
    dispatch(connectionActions.updateStatus([id, true]));
  });

  useIpcListener(IpcChannel.CONNECTION_CLOSED, (id) => {
    console.log(`Connection ${id} closed`);
    dispatch(connectionActions.updateStatus([id, false]));
  });

  useIpcListener(IpcChannel.CONNECTION_ERROR, (id, error) => {
    console.log(`Error on connection ${id}`, error);
    dispatch(connectionActions.updateStatus([id, false]));
  });

  return { openConnection, closeConnection }
};
