import { connectionManager } from 'main/connection';
import connectManageDb from 'main/database/connectManage';
import connectControlDb from 'main/database/connectControl';

export default {
  getAll() {
    try {
      const data: any[] = connectManageDb.getAll();
      if (data) {
        data.forEach((item) => {
          const control = connectControlDb.getById(item.id);
          item.control = control;
        });
      }
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
      const result = { ...data };
      if (values.control) {
        const control: any = connectControlDb.update(data.id, values.control);
        result.control = control;
      }
      connectionManager.createConnection(data.id, data, result.control);
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
      const result = { ...data };
      if (values.control) {
        const control: any = connectControlDb.update(data.id, values.control);
        result.control = control;
      }
      connection.update(data, result.control);
      return { success: true, data: result };
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
      connectControlDb.delete(id);
      connectionManager.deleteConnection(id);
      return { success: true };
    } catch (error) {
      console.log('Delete connection error', error);
      return { success: false, message: error.message };
    }
  },
};
