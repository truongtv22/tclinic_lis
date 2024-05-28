export enum KqBW200IpcChannel {
  GET_KQ_BW200 = 'get-kq-bw200',
  CREATE_KQ_BW200 = 'create-kq-bw200',
  UPDATE_KQ_BW200 = 'update-kq-bw200',
  DELETE_KQ_BW200 = 'delete-kq-bw200',
}

export type KqBW200IpcCommands = {
  [KqBW200IpcChannel.GET_KQ_BW200]: (params: any) => {
    success: boolean;
    data?: any[];
    message?: string;
  };
  [KqBW200IpcChannel.CREATE_KQ_BW200]: (data: any) => {
    success: boolean;
    data?: any;
    message?: string;
  };
  [KqBW200IpcChannel.UPDATE_KQ_BW200]: (
    id: number,
    data: any,
  ) => {
    success: boolean;
    data?: any;
    message?: string;
  };
  [KqBW200IpcChannel.DELETE_KQ_BW200]: (id: number) => {
    success: boolean;
    message?: string;
  };
};
