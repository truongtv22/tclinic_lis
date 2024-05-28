import { IpcEvents } from 'shared/ipcs';
import { WINDOW_ID } from 'shared/constants';
import { windowManager } from '../window';

export const sendMessage = <K extends keyof IpcEvents>(
  channel: K,
  ...args: Parameters<IpcEvents[K]>
) => {
  const window = windowManager.getWindow(WINDOW_ID.MAIN);
  if (window) {
    return window.webContents?.send(channel, ...args);
  }
};
