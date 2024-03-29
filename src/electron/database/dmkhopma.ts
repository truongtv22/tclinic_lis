import connect from './index';

export default {
  getByLab(lab: string) {
    const db = connect();
    const stmList = db.prepare('select * from [dbo.dmkhopma] where lab = @lab');

    try {
      const data = stmList.all({ lab });
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error };
    }
  },
};
