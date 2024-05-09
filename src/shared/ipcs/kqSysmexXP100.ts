export enum KqSysmexXP100IpcChannel {
  GET_KQ_SYSMEX_XP100 = 'get-kq-sysmex-xp100',
  CREATE_KQ_SYSMEX_XP100 = 'create-kq-sysmex-xp100',
  UPDATE_KQ_SYSMEX_XP100 = 'update-kq-sysmex-xp100',
  DELETE_KQ_SYSMEX_XP100 = 'delete-kq-sysmex-xp100',
  SEND_HIS_KQ_SYSMEX_XP100 = 'send-his-kq-sysmex-xp100',
}

export type KqSysmexXP100IpcCommands = {
  [KqSysmexXP100IpcChannel.GET_KQ_SYSMEX_XP100]: (params: any) => {
    success: boolean;
    data?: any[];
    message?: string;
  };
  [KqSysmexXP100IpcChannel.CREATE_KQ_SYSMEX_XP100]: (data: any) => {
    success: boolean;
    data?: any;
    message?: string;
  };
  [KqSysmexXP100IpcChannel.UPDATE_KQ_SYSMEX_XP100]: (
    id: number,
    data: any,
  ) => {
    success: boolean;
    data?: any;
    message?: string;
  };
  [KqSysmexXP100IpcChannel.DELETE_KQ_SYSMEX_XP100]: (id: number) => {
    success: boolean;
    message?: string;
  };
  [KqSysmexXP100IpcChannel.SEND_HIS_KQ_SYSMEX_XP100]: (
    id: number,
    data: any,
  ) => {
    success: boolean;
    message?: string;
  };
};
