export interface Connection {
  [key: string]: any;
  id: number;
}

export interface ConnectionState {
  connectionList: Connection[];
  connectedIds: number[];
}
