import Log from 'electron-log';
import kqBioSystemA15Db from 'main/database/kqBioSystemA15';

export default {
  getAll(params = {}) {
    try {
      const result = kqBioSystemA15Db.queryAll(params);
      return { success: true, data: result.data };
    } catch (error) {
      Log.error(error);
      return { success: false, message: error.message };
    }
  },

  create(values: any) {
    try {
      const data = kqBioSystemA15Db.create(values);
      return { success: true, data };
    } catch (error) {
      Log.error(error);
      return { success: false, message: error.message };
    }
  },

  update(id: number, values: any) {
    try {
      const data = kqBioSystemA15Db.update(id, values);
      return { success: true, data };
    } catch (error) {
      Log.error(error);
      return { success: false, message: error.message };
    }
  },

  delete(id: number) {
    try {
      kqBioSystemA15Db.delete(id);
      return { success: true };
    } catch (error) {
      Log.error(error);
      return { success: false, message: error.message };
    }
  },
};
