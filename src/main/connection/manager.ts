import connectManageDb from '../database/connectManage';
import { Connection, ConnectionData } from './connection';

class ConnectionManager {
  connections: Record<number, Connection> = {};

  init() {
    try {
      const data: any[] = connectManageDb.getAll();
      if (data && data.length > 0) {
        this.setConnections(data);
        this.openAllConnections();
      }
    } catch (error) {
      console.log('Error init connection manager', error);
    }
  }

  setConnections(connections: ConnectionData[]) {
    for (const item of connections) {
      this.addConnection(item.id, item);
    }
  }

  getStatusConnections() {
    const data: { [key: number]: boolean } = {};
    for (const id in this.connections) {
      data[id] = this.connections[id].isOpen;
    }
    return data;
  }

  openAllConnections() {
    for (const id in this.connections) {
      this.openConnection(id, { retry: true });
    }
  }

  closeAllConnections() {
    for (const id in this.connections) {
      this.closeConnection(id);
    }
  }

  getConnection(id: number) {
    return this.connections[id] || null;
  }

  addConnection(id: number, data: ConnectionData) {
    const connection = this.connections[id];
    if (connection) return;
    const newConnection = new Connection(id, data);
    this.connections[id] = newConnection;
  }

  updateConnection(id: number, data: ConnectionData) {
    const connection = this.connections[id];
    if (connection) {
      connection.update(data);
    }
  }

  removeConnection(id: number) {
    const connection = this.connections[id];
    if (connection) {
      connection.close();
      delete this.connections[id];
    }
  }

  openConnection(id: number, options = {}) {
    const connection = this.connections[id];
    if (connection) connection.open(options);
  }

  closeConnection(id: number) {
    const connection = this.connections[id];
    if (connection) connection.close();
  }
}

export const connectionManager = new ConnectionManager();
