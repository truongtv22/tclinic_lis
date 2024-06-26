import connectManageDb from '../database/connectManage';
import connectConfigDb from '../database/connectConfig';
import { Connection, ConnectionData, ConnectionConfig } from './connection';

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
      if (item.active) {
        const config = connectConfigDb.getById(item.id);
        this.createConnection(item.id, item, config);
      }
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
      this.openConnection(+id, { retry: true });
    }
  }

  closeAllConnections() {
    for (const id in this.connections) {
      this.closeConnection(+id);
    }
  }

  getConnection(id: number) {
    return this.connections[id] || null;
  }

  createConnection(
    id: number,
    data: ConnectionData,
    config?: ConnectionConfig,
  ) {
    const connection = this.connections[id];
    if (connection) return connection;
    const newConnection = new Connection(id, data, config);
    this.connections[id] = newConnection;
    return newConnection;
  }

  updateConnection(
    id: number,
    data: ConnectionData,
    config?: ConnectionConfig,
  ) {
    const connection = this.connections[id];
    if (connection) {
      connection.update(data, config);
    }
    return connection;
  }

  deleteConnection(id: number) {
    const connection = this.connections[id];
    if (connection) {
      if (connection.isOpen) connection.close();
      delete this.connections[id];
    }
  }

  openConnection(id: number, options = {}) {
    const connection = this.connections[id];
    if (connection) connection.open(options);
  }

  closeConnection(id: number) {
    const connection = this.connections[id];
    if (connection && connection.isOpen) {
      connection.close();
    }
  }
}

export const connectionManager = new ConnectionManager();
