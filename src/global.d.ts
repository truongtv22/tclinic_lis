declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        delete: (key) => void;
      };
      serialport: {
        connect: (params: any) => void;
        disconnect: () => void;
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
  }
}

export {};
