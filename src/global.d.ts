declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        delete: (key) => void;
      };
      serialport: {
        connect: (options: any) => void;
        disconnect: () => void;
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
