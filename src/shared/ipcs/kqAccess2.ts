export enum KqAccess2IpcChannel {
  GET_KQ_ACCESS2 = 'get-kq-access2',
  CREATE_KQ_ACCESS2 = 'create-kq-access2',
  UPDATE_KQ_ACCESS2 = 'update-kq-access2',
  DELETE_KQ_ACCESS2 = 'delete-kq-access2',
  SEND_HIS_KQ_ACCESS2 = 'send-his-kq-access2',
}

export type KqAccess2IpcCommands = {
  [KqAccess2IpcChannel.GET_KQ_ACCESS2]: (params: any) => {
    success: boolean;
    data?: any[];
    message?: string;
  };
  [KqAccess2IpcChannel.CREATE_KQ_ACCESS2]: (data: any) => {
    success: boolean;
    data?: any;
    message?: string;
  };
  [KqAccess2IpcChannel.UPDATE_KQ_ACCESS2]: (
    id: number,
    data: any,
  ) => {
    success: boolean;
    data?: any;
    message?: string;
  };
  [KqAccess2IpcChannel.DELETE_KQ_ACCESS2]: (id: number) => {
    success: boolean;
    message?: string;
  };
  [KqAccess2IpcChannel.SEND_HIS_KQ_ACCESS2]: (
    id: number,
    data: any,
  ) => {
    success: boolean;
    message?: string;
  };
};
