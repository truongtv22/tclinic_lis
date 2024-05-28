import { IpcChannel } from 'shared/ipcs/types';

export default {
  async sendHis(connectId: number, id: number, data: any) {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.SEND_HIS,
      connectId,
      id,
      data,
    );
    return result;
  },

  async cancelHis(connectId: number, id: number, data: any) {
    const result = await window.electron.ipcRenderer.invoke(
      IpcChannel.CANCEL_HIS,
      connectId,
      id,
      data,
    );
    return result;
  },
};
