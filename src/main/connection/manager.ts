import { Connection, ConnectionData } from './index';

class ConnectionManager {
  connections: Record<string, Connection> = {};

  setConnections(connections: ConnectionData[]) {
    for (const item of connections) {
      this.addConnection(item.id, item);
    }
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

  getConnection(id: string) {
    return this.connections[id] || null;
  }

  addConnection(id: string, data: ConnectionData) {
    const connection = this.connections[id];
    if (connection) return;
    const newConnection = new Connection(id, data);
    this.connections[id] = newConnection;
  }

  updateConnection(id: string, data: ConnectionData) {
    const connection = this.connections[id];
    if (connection) {

      connection.update(data);
    }
  }

  removeConnection(id: string) {
    const connection = this.connections[id];
    if (connection) {
      connection.close();
      delete this.connections[id];
    }
  }

  openConnection(id: string, options = {}) {
    const connection = this.connections[id];
    if (connection) connection.open(options);
  }

  closeConnection(id: string) {
    const connection = this.connections[id];
    if (connection) connection.close();
  }
}

export const connectionManager = new ConnectionManager();
