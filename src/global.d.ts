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
  }
}

export {};
