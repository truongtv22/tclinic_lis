import { useEffect } from 'react';

export const useIpcRenderer = (
  channel: string,
  listener: (...args: any[]) => void,
) => {
  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(channel, listener);
    return () => unsubscribe();
  }, []);
};
