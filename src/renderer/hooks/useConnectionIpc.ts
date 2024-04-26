import { useDispatch } from 'react-redux';
import { IpcChannel } from 'shared/ipcs/types';
import { connectionActions } from 'renderer/store/connection';
import { useIpcListener } from './useIpcListener';

export const useConnectionIpc = () => {
  const dispatch = useDispatch();

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
};
