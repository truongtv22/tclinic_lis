import path from 'path';
import { BrowserWindow, ipcMain } from 'electron';
import { StatefullBrowserWindow } from 'stateful-electron-window';

export const createMainWindow = () => {
  // Create the browser window
  const window = new StatefullBrowserWindow({
    width: 1270,
    height: 860,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  ipcMain.on('subscribe', async (state: any) => {
    if (window?.isDestroyed()) return;
    window?.webContents?.send('subscribe', state);
  });

  // Remove the linux, window menu bar
  // window.removeMenu();

  // Disable macOS menu bar
  // Menu.setApplicationMenu(Menu.buildFromTemplate([]));

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    window.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  window.webContents.on('did-finish-load', () => {
    // We close the DevTools so that it can be reopened and redux reconnected.
    // This is a workaround for a bug in redux devtools.
    // window.webContents.closeDevTools();
    // window.webContents.once('devtools-opened', () => {
    //   window.focus();
    // });
    window?.webContents.openDevTools();
  });

  return window;
};

export const createViewWindow = () => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/#/view`);
  } else {
    window.loadFile(
      path.join(
        __dirname,
        `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html/#/view`,
      ),
    );
  }

  return window;
};
