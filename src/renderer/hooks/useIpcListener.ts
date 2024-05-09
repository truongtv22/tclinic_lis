import { useEffect, DependencyList } from 'react';
import { IpcEvents } from 'shared/ipcs/types';

export const useIpcListener = <K extends keyof IpcEvents>(
  channel: K,
  listener: (...args: Parameters<IpcEvents[K]>) => void,
  deps?: DependencyList,
) => {
  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(channel, listener);
    return () => unsubscribe();
  }, deps);
};
