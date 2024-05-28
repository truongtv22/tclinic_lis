import logSendDb from 'main/database/logSend';

export default {
  getAll(params = {}) {
    try {
      const result = logSendDb.queryAll(params);
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};
