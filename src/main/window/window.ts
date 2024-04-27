import path from 'path';
import { BrowserWindow, ipcMain } from 'electron';
import { StatefullBrowserWindow } from 'stateful-electron-window';
import { is } from '@electron-toolkit/utils';
import { WINDOW_ID } from 'shared/constants';
import { WebContents } from 'shared/ipcs';

interface TypedBrowserWindow extends BrowserWindow {
  webContents: WebContents;
}

export class Window {
  id: string;
  instance: TypedBrowserWindow | null;

  constructor(id: string) {
    this.id = id;
    this.instance = null;

    // ipcMain.on('subscribe', async (state: any) => {
    //   if (this.instance?.isDestroyed()) return;
    //   this.instance?.webContents?.send('subscribe', state);
    // });
  }

  get webContents() {
    return this.instance?.webContents;
  }

  create() {
    if (this.instance) return;
    if (this.id === WINDOW_ID.MAIN) {
      this.instance = new StatefullBrowserWindow({
        width: 1270,
        height: 860,
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        webPreferences: {
          preload: path.join(__dirname, '../preload/index.js'),
          sandbox: false,
          // nodeIntegration: true,
        },
      });

      // and load the index.html of the app.
      if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        this.instance.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
      } else {
        this.instance.loadFile(path.join(__dirname, `../renderer/index.html`));
      }

      // Open the DevTools.
      this.instance.webContents.on('did-finish-load', () => {
        if (is.dev) this.instance?.webContents.openDevTools();
      });
    }
    if (this.id === WINDOW_ID.VIEW) {
      this.instance = new BrowserWindow({
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
        this.instance.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/#/view`);
      } else {
        this.instance.loadFile(
          path.join(__dirname, `../renderer/index.html/#/view`),
        );
      }
    }

    this.instance.on('close', this.destroy);
    this.instance.on('closed', this.destroy);
  }

  destroy() {
    this.instance?.destroy();
    this.instance = null;
  }

  focus() {
    this.instance?.focus();
  }

  reload() {
    this.instance?.reload();
  }
}
