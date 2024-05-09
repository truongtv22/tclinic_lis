export interface Connection {
  id: number;
  active: number;
  comp: string;
  lab: string;
  [key: string]: any;
}

export interface ConnectionState {
  connectionList: Connection[];
  connectionStatus: { [key: number]: boolean };
}
