import { useDispatch } from 'react-redux';
import { IpcChannel } from 'shared/ipcs/types';
import { connectionActions } from 'renderer/store/connection';
import { notification } from './useGlobal';
import { useIpcListener } from './useIpcListener';

export const useConnectionIpc = () => {
  const dispatch = useDispatch();

  const openConnection = (id: number) => {
    window.electron.ipcRenderer.send(IpcChannel.OPEN_CONNECTION, id);
  };

  const closeConnection = (id: number) => {
    window.electron.ipcRenderer.send(IpcChannel.CLOSE_CONNECTION, id);
  };

  useIpcListener(IpcChannel.CONNECTION_OPENED, (id) => {
    console.log(`Connection ${id} opened`);
    notification.success({
      message: 'Kết nối thiết bị thành công',
    });
    dispatch(connectionActions.updateStatus([id, true]));
  });

  useIpcListener(IpcChannel.CONNECTION_CLOSED, (id) => {
    console.log(`Connection ${id} closed`);
    dispatch(connectionActions.updateStatus([id, false]));
  });

  useIpcListener(IpcChannel.CONNECTION_ERROR, (id, error, retry) => {
    console.log(`Error on connection ${id}`, error);
    if (!retry) {
      notification.error({
        message: 'Lỗi kết nối thiết bị',
        description: error.message,
      });
    }
    dispatch(connectionActions.updateStatus([id, false]));
  });

  return { openConnection, closeConnection };
};
