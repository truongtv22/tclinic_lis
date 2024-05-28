import Log from 'electron-log';
import kqBW200Db from 'main/database/kqBW200';

export default {
  getAll(params = {}) {
    try {
      const result = kqBW200Db.queryAll(params);
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  create(values: any) {
    try {
      const data = kqBW200Db.create(values);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  update(id: number, values: any) {
    try {
      const data = kqBW200Db.update(id, values);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  delete(id: number) {
    try {
      kqBW200Db.delete(id);
      return { success: true };
    } catch (error) {
      Log.error(error);
      return { success: false, message: error.message };
    }
  },
};
