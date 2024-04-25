import { useEffect } from 'react';
import { EventChannel, EventParam } from 'shared/ipcs/types';

export const useIpcListener = (
  channel: EventChannel,
  listener: (...args: Parameters<EventParam>) => void,
) => {
  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(channel, listener);
    return () => unsubscribe();
  }, []);
};
