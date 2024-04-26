export enum ConnectionIpcChannel {
  OPEN_CONNECTION = 'open-connection',
  CLOSE_CONNECTION = 'close-connection',

  GET_ALL_CONNECTION = 'get-all-connection',
  GET_ALL_CONNECTION_STATUS = 'get-all-connection-status',
  GET_CONNECTION = 'get-connection',
  CREATE_CONNECTION = 'create-connection',
  UPDATE_CONNECTION = 'update-connection',
  DELETE_CONNECTION = 'delete-connection',

  CONNECTION_OPENED = 'connection-opened',
  CONNECTION_CLOSED = 'connection-closed',
  CONNECTION_ERROR = 'connection-error',
}

export type ConnectionIpcEvents = {
  [ConnectionIpcChannel.OPEN_CONNECTION]: (id: number) => void;
  [ConnectionIpcChannel.CLOSE_CONNECTION]: (id: number) => void;

  [ConnectionIpcChannel.CONNECTION_OPENED]: (id: number) => void;
  [ConnectionIpcChannel.CONNECTION_CLOSED]: (id: number) => void;
  [ConnectionIpcChannel.CONNECTION_ERROR]: (id: number, error: any) => void;
};

export type ConnectionIpcCommands = {
  [ConnectionIpcChannel.GET_ALL_CONNECTION]: () => {
    success: boolean;
    data?: any[];
    message?: string;
  };
  [ConnectionIpcChannel.GET_ALL_CONNECTION_STATUS]: () => {
    success: boolean;
    data?: { [key: string]: boolean };
    message?: string;
  };
  [ConnectionIpcChannel.GET_CONNECTION]: (id: number) => {
    success: boolean;
    data?: any;
    message?: string;
  };
  [ConnectionIpcChannel.CREATE_CONNECTION]: (data: any) => {
    success: boolean;
    data?: any;
    message?: string;
  };
  [ConnectionIpcChannel.UPDATE_CONNECTION]: (
    id: number,
    data: any,
  ) => {
    success: boolean;
    data?: any;
    message?: string;
  };
  [ConnectionIpcChannel.DELETE_CONNECTION]: (id: number) => {
    success: boolean;
    message?: string;
  };
};
