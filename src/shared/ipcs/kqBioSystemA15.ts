export enum KqBioSystemA15IpcChannel {
  GET_KQ_BIOSYSTEM_A15 = 'get-kq-bio-system-a15',
  CREATE_KQ_BIOSYSTEM_A15 = 'create-kq-bio-system-a15',
  UPDATE_KQ_BIOSYSTEM_A15 = 'update-kq-bio-system-a15',
  DELETE_KQ_BIOSYSTEM_A15 = 'delete-kq-bio-system-a15',
}

export type KqBioSystemA15IpcCommands = {
  [KqBioSystemA15IpcChannel.GET_KQ_BIOSYSTEM_A15]: (params: any) => {
    success: boolean;
    data?: any[];
    message?: string;
  };
  [KqBioSystemA15IpcChannel.CREATE_KQ_BIOSYSTEM_A15]: (data: any) => {
    success: boolean;
    data?: any;
    message?: string;
  };
  [KqBioSystemA15IpcChannel.UPDATE_KQ_BIOSYSTEM_A15]: (
    id: number,
    data: any,
  ) => {
    success: boolean;
    data?: any;
    message?: string;
  };
  [KqBioSystemA15IpcChannel.DELETE_KQ_BIOSYSTEM_A15]: (id: number) => {
    success: boolean;
    message?: string;
  };
};
