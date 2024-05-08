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
};
