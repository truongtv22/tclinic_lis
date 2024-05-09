import { IpcChannel } from 'shared/ipcs/types';

export default {
  async getAll(params: any) {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.GET_KQ_BW200,
      params,
    );
    return result;
  },
};
