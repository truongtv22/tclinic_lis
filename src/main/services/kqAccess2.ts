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
};
