import type { PreloadReduxBridgeReturn } from 'reduxtron/types';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send(channel: string, ...args: any[]): void;
        invoke: (channel: string, ...args: any[]) => Promise<any>;
        on(channel: string, func: (...args: any[]) => void): () => void;
        once(channel: string, func: (...args: any[]) => void): void;
      };
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        delete: (key) => void;
      };
      serialport: {
        connect: (params: any) => void;
        disconnect: (params?: any) => void;
        on: (event: any, listener: (...args: unknown[]) => void) => () => void;
        one: (event: any, listener: (...args: unknown[]) => void) => void;
      };
    };

    dbApi: {
      getConnect: () => Promise<any>;
      createConnect: (values: any) => Promise<any>;
      updateConnect: (values: any) => Promise<any>;
      deleteConnect: (id: any) => Promise<any>;
    };

    reduxtron: PreloadReduxBridgeReturn<State, Action>['handlers'];
  }
}

export {};
