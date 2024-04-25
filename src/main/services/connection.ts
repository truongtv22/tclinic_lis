import { connectionManager } from 'main/connection';
import connectManageDb from '../database/connectManage';

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
      return { success: false, message: error };
    }
  },

  getAllStatus() {
    try {
      const data = connectionManager.getStatusConnections();
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error };
    }
  },

  create(values: any) {
    try {
      const data = connectManageDb.create(values);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error };
    }
  },

  update(id: number, values: any) {
    try {
      const data = connectManageDb.update(id, values);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error };
    }
  },

  delete(id: number) {
    try {
      connectManageDb.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false, message: error };
    }
  },
};
