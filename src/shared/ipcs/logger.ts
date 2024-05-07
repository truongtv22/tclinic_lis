export enum LoggerIpcChannel {
  GET_LOG = 'get-log',
  LOG_CHANGED = 'log-changed',
  CLEAR_LOG = 'clear-log',
}

export type LoggerIpcEvents = {
  [LoggerIpcChannel.GET_LOG]: (scope: string) => any[];
  [LoggerIpcChannel.CLEAR_LOG]: (scope: string) => void;
  [LoggerIpcChannel.LOG_CHANGED]: (scope: string, message: any) => void;
};
