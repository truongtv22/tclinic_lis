export enum WindowIpcChannels {
  MAIN_WINDOW_RELOAD = 'main-window-reload',
  OPEN_VIEW_WINDOW = 'open-view-window',
}

export type WindowIpcEvents = {
  [WindowIpcChannels.MAIN_WINDOW_RELOAD]: () => void;
  [WindowIpcChannels.OPEN_VIEW_WINDOW]: () => void;
};
