export function createElectronStorage() {
  return {
    getItem: (key: string) => {
      return new Promise((resolve) => {
        resolve(window.electron.store.get(key));
      });
    },
    setItem: (key: string, item: any) => {
      return new Promise((resolve) => {
        resolve(window.electron.store.set(key, item));
      });
    },
    removeItem: (key: string) => {
      return new Promise((resolve) => {
        resolve(window.electron.store.delete(key));
      });
    },
  };
}
