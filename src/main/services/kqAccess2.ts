import Log from 'electron-log';
import kqAccess2Db from 'main/database/kqAccess2';

export default {
  getAll(params = {}) {
    try {
      const result = kqAccess2Db.queryAll(params);
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  create(values: any) {
    try {
      const data = kqAccess2Db.create(values);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  update(id: number, values: any) {
    try {
      const data = kqAccess2Db.update(id, values);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  delete(id: number) {
    try {
      kqAccess2Db.delete(id);
      return { success: true };
    } catch (error) {
      Log.error(error);
      return { success: false, message: error.message };
    }
  },
};
