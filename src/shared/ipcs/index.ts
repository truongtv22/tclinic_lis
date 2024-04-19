import { ipcMain, ipcRenderer } from 'electron';
import { TypedIpcMain, TypedIpcRenderer } from 'electron-typed-ipc';
import { WindowIpcChannels, WindowIpcEvents } from './window';

interface Config {
  id: number;
  name: string;
  description: string;
  value: string;
}

enum ConfigIpcChannels {
  FetchConfig = 'fetch-config',
  UpdateConfig = 'update-config',
  ConfigUpdated = 'config-updated',
}

type ConfigIpcEvents = {
  [ConfigIpcChannels.ConfigUpdated]: (
    newConfig?: Config,
    oldConfig?: Config,
  ) => void;
};

// type IpcEvents = {
//   configUpdated: (newConfig?: Config, oldConfig?: Config) => void;
// };

type IpcCommands = {
  [ConfigIpcChannels.FetchConfig]: () => Config;
  [ConfigIpcChannels.UpdateConfig]: (newConfig: Partial<Config>) => Config;
};

type IpcEvents = WindowIpcEvents & ConfigIpcEvents;

type IpcChannels = WindowIpcChannels & ConfigIpcChannels;
// let a: IpcChannels = WindowIpcChannels.MAIN_WINDOW_RELOAD
// a === WindowIpcChannels.MAIN_WINDOW_RELOAD
// IpcChannels.ConfigUpdated
export const sharedIpcMain = ipcMain as TypedIpcMain<IpcEvents, IpcCommands>;
export const sharedIpcRenderer = ipcRenderer as TypedIpcRenderer<
  IpcEvents,
  IpcCommands
>;

sharedIpcMain.on(WindowIpcChannels.MAIN_WINDOW_RELOAD, () => {});
sharedIpcMain.on(
  ConfigIpcChannels.ConfigUpdated,
  (_, newConfig, oldConfig) => {},
);
