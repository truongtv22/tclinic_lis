import { useEffect } from 'react';

export default function useIpcRenderer(
  channel: string,
  listener: (...args: any[]) => void,
) {
  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(channel, listener);
    return () => unsubscribe();
  }, []);
}
