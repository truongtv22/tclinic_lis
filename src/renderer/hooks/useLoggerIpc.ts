import { useEffect, useState } from 'react';
import { produce } from 'immer';
import { IpcChannel } from 'shared/ipcs/types';
import { useIpcListener } from './useIpcListener';

export const useLoggerIpc = (scope: string) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getLog();
  }, [scope]);

  useIpcListener(IpcChannel.LOG_CHANGED, (changed, message) => {
    if (changed === scope) {
      setLogs(
        produce((draft) => {
          draft.unshift(message);
        }),
      );
    }
  });

  const getLog = () => {
    const data = window.electron.ipcRenderer.sendSync(
      IpcChannel.GET_LOG,
      scope,
    );
    if (data) setLogs(data);
  };

  const clearLog = () => {
    setLogs([]);
    window.electron.ipcRenderer.send(IpcChannel.CLEAR_LOG, scope);
  };

  return { logs, getLog, clearLog };
};
