// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { readAllPerson, insertPerson } from "./database/person_service";

export type Channels = string;

contextBridge.exposeInMainWorld("electron", {
  store: {
    get(key: string) {
      return ipcRenderer.sendSync("electron-store-get", key);
    },
    set(key: string, value: any) {
      ipcRenderer.send("electron-store-set", key, value);
    },
    delete(key: string) {
      ipcRenderer.send("electron-store-delete", key);
    },
  },
  serialport: {
    connect: (options: any) => {
      ipcRenderer.send("serialport-connect", options);
    },
    disconnect: () => {
      ipcRenderer.send("serialport-disconnect");
    },
  },
  
  ipcRenderer: {
    setStoreValue: (key: string, value: any) => {
      ipcRenderer.send("setStore", key, value);
    },

    getStoreValue(key: string) {
      const resp = ipcRenderer.sendSync("getStore", key);
      return resp;
    },

    send(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },

    invoke: async (channel: Channels, data: any) => {
      const result = await ipcRenderer.invoke(channel, data);
      return result;
    },
    
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

contextBridge.exposeInMainWorld("sqlite", {
  // personDB: {
  //   readAllPerson: () => readAllPerson(),
  //   insertPerson: (name: any, age: any) => insertPerson(name, age),
  // },
  test: () => console.log("testthinklabs"),
});

document.addEventListener("DOMContentLoaded", async () => {
  ipcRenderer.on("serialport-data", (event, data) => {
    console.log("serialport-data", data);
  });
});
