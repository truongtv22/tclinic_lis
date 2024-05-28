export enum SyncHisIpcChannel {
  SEND_HIS = 'send-his',
  CANCEL_HIS = 'cancel-his',

  HIS_SENT = 'his-sent',
  HIS_CANCELED = 'his-canceled',
}

export type SyncHisIpcEvents = {
  [SyncHisIpcChannel.HIS_SENT]: (
    connectId: number,
    id: number,
    data: any,
  ) => void;
  [SyncHisIpcChannel.HIS_CANCELED]: (
    connectId: number,
    id: number,
    data: any,
  ) => void;
};

export type SyncHisIpcCommands = {
  [SyncHisIpcChannel.SEND_HIS]: (
    connectId: number,
    id: number,
    data: any,
  ) => {
    success: boolean;
    message?: string;
  };
  [SyncHisIpcChannel.CANCEL_HIS]: (
    connectId: number,
    id: number,
    data: any,
  ) => {
    success: boolean;
    message?: string;
  };
};
