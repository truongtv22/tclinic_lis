export enum WindowIpcChannel {
  MAIN_WINDOW_RELOAD = 'main-window-reload',
  OPEN_VIEW_WINDOW = 'open-view-window',
  OPEN_APP_FOLDER = 'open-app-folder',
  SELECT_FOLDER = 'select-folder',
}

export type WindowIpcEvents = {
  [WindowIpcChannel.MAIN_WINDOW_RELOAD]: () => void;
  [WindowIpcChannel.OPEN_VIEW_WINDOW]: () => void;
  [WindowIpcChannel.OPEN_APP_FOLDER]: () => void;
};

export type WindowIpcCommands = {
  [WindowIpcChannel.SELECT_FOLDER]: () => {
    folderPath: string;
    canceled: boolean;
  };
};
