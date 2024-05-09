import { IpcChannel } from 'shared/ipcs/types';

export default {
  async getAll(params: any) {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.GET_KQ_SYSMEX_XP100,
      params,
    );
    return result;
  },
};
