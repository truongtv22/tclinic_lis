export enum LogSendIpcChannel {
  GET_LOG_SEND = 'get-log-send',
}

export type LogSendIpcCommands = {
  [LogSendIpcChannel.GET_LOG_SEND]: (params: any) => {
    success: boolean;
    data?: any[];
    message?: string;
  };
};
