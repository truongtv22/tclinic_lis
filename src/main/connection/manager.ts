class ConnectionManager {
  connections: Map<string, any> = new Map();

  connect() {}

  disconnect() {}
}

export const connectionManager = new ConnectionManager();
