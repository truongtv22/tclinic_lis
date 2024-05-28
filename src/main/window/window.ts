import path from 'path';
import { BrowserWindow, ipcMain } from 'electron';
import querystring from 'querystring';
import windowStateKeeper from 'electron-window-state';
import { is } from '@electron-toolkit/utils';
import { WINDOW_ID } from 'shared/constants';
import { WebContents } from 'shared/ipcs';

interface TypedBrowserWindow extends BrowserWindow {
  webContents: WebContents;
}

export class Window {
  id: string;
  params?: any;
  instance: TypedBrowserWindow | null;

  constructor(id: string, params?: any) {
    this.id = id;
    this.params = params;
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
    if (this.id === WINDOW_ID.MAIN) {
      const windowState = windowStateKeeper({
        defaultWidth: 1270,
        defaultHeight: 860,
      });
      this.instance = new BrowserWindow({
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        minWidth: 800,
        minHeight: 600,
        autoHideMenuBar: true,
        webPreferences: {
          preload: path.join(__dirname, '../preload/index.js'),
          sandbox: false,
          // nodeIntegration: true,
        },
      });
      this.loadPage();

      windowState.manage(this.instance);
    }
    if (this.id === WINDOW_ID.VIEW) {
      this.instance = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
          preload: path.join(__dirname, '../preload/index.js'),
          sandbox: false,
        },
      });
      this.loadPage();
    }

    // Open the DevTools.
    this.instance.webContents.on('did-finish-load', () => {
      if (is.dev) this.instance?.webContents.openDevTools();
    });

    this.instance.on('close', () => this.destroy());
    this.instance.on('closed', () => this.destroy());
  }

  update(params?: any) {
    this.params = params;
  }

  loadPage() {
    if (this.id === WINDOW_ID.MAIN) {
      // and load the index.html of the app.
      if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        this.instance.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
      } else {
        this.instance.loadFile(path.join(__dirname, `../renderer/index.html`));
      }
    }
    if (this.id === WINDOW_ID.VIEW) {
      const search = this.params ? querystring.stringify(this.params) : '';

      // and load the index.html of the app.
      if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        this.instance.loadURL(
          `${MAIN_WINDOW_VITE_DEV_SERVER_URL}?${search}#/view`,
        );
      } else {
        this.instance.loadFile(path.join(__dirname, `../renderer/index.html`), {
          hash: 'view',
          search,
        });
      }
    }
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

  show() {
    this.instance?.show();
  }
}
