import { IpcChannel } from 'shared/ipcs/types';

export default {
  async getAll() {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.GET_ALL_CONNECTION,
    );
    return result;
  },

  async getAllStatus() {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.GET_ALL_CONNECTION_STATUS,
    );
    return result;
  },

  async create(values: any) {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.CREATE_CONNECTION,
      values,
    );
    return result;
  },

  async update(id: number, values: any) {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.UPDATE_CONNECTION,
      id,
      values,
    );
    return result;
  },

  async delete(id: number) {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.DELETE_CONNECTION,
      id,
    );
    return result;
  },
};
