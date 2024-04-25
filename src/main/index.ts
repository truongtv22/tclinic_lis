import { app, ipcMain } from 'electron';
import log from 'electron-log/main';
import installExtensions, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
// import { mainReduxBridge } from 'reduxtron/main';
import { WINDOW_ID } from 'shared/constants';
// import { getConnections } from 'shared/_store/connection/actions';
// import { store } from './_store';
import { initDatabase } from './database';
import { registerIpcs } from './ipcs';
import { windowManager } from './window';

log.initialize();
Object.assign(console, log.functions);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// const { unsubscribe } = mainReduxBridge(ipcMain, store);

const createWindow = () => {
  windowManager.createWindow(WINDOW_ID.MAIN);
};

const loadExtensions = async () => {
  try {
    const result = await installExtensions(
      [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS],
      { loadExtensionOptions: { allowFileAccess: true } },
    );
    console.log(`Added Extension:  ${result}`);
  } catch (error) {
    console.log('An error occurred: ', error);
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  loadExtensions();
  initDatabase();
  // store.dispatch(getConnections());
  createWindow();
  registerIpcs();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  const mainWindow = windowManager.getWindow(WINDOW_ID.MAIN);
  if (mainWindow === null) createWindow();
  // if (BrowserWindow.getAllWindows().length === 0) {
  //   createWindow();
  // }
});

// app.on('quit', unsubscribe);
