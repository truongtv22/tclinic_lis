import Log from 'electron-log';
import kqSysmexXP100Db from 'main/database/kqSysmexXP100';

export default {
  getAll(params = {}) {
    try {
      const result = kqSysmexXP100Db.queryAll(params);
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  create(values: any) {
    try {
      const data = kqSysmexXP100Db.create(values);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  update(id: number, values: any) {
    try {
      const data = kqSysmexXP100Db.update(id, values);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  delete(id: number) {
    try {
      kqSysmexXP100Db.delete(id);
      return { success: true };
    } catch (error) {
      Log.error(error);
      return { success: false, message: error.message };
    }
  },
};
