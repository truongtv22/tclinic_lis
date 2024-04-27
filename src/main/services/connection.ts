import { connectionManager } from 'main/connection';
import connectManageDb from 'main/database/connectManage';

export default {
  getAll() {
    try {
      const data = connectManageDb.getAll();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error };
    }
  },

  getById(id: number) {
    try {
      const data = connectManageDb.getById(id);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  getAllStatus() {
    try {
      const data = connectionManager.getStatusConnections();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  create(values: any) {
    try {
      const data: any = connectManageDb.create(values);
      connectionManager.createConnection(data.id, data);
      return { success: true, data };
    } catch (error) {
      console.log('Create connection error', error);
      return { success: false, message: error.message };
    }
  },

  update(id: number, values: any) {
    try {
      const connection = connectionManager.getConnection(id);
      if (connection && connection.isOpen) {
        return {
          success: false,
          message:
            'Thiết bị đang kết nối, vui lòng đóng kết nối trước khi thực hiện hành động',
        };
      }
      const data: any = connectManageDb.update(id, values);
      connectionManager.updateConnection(id, data);
      return { success: true, data };
    } catch (error) {
      console.log('Update connection error', error);
      return { success: false, message: error.message };
    }
  },

  delete(id: number) {
    try {
      const connection = connectionManager.getConnection(id);
      if (connection && connection.isOpen) {
        return {
          success: false,
          message:
            'Thiết bị đang kết nối, vui lòng đóng kết nối trước khi thực hiện hành động',
        };
      }
      connectManageDb.delete(id);
      connectionManager.deleteConnection(id);
      return { success: true };
    } catch (error) {
      console.log('Delete connection error', error);
      return { success: false, message: error.message };
    }
  },
};
