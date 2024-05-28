import { IpcChannel } from 'shared/ipcs/types';

export default {
  async getAll(params: any) {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.GET_KQ_BW200,
      params,
    );
    return result;
  },

  async create(values: any) {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.CREATE_KQ_BW200,
      values,
    );
    return result;
  },

  async update(id: number, values: any) {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.UPDATE_KQ_BW200,
      id,
      values,
    );
    return result;
  },

  async delete(id: number) {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.DELETE_KQ_BW200,
      id,
    );
    return result;
  },
};
