import connect from './index';

export default {
  queryAll(
    params: {
      startDate?: string;
      endDate?: string;
      barcode?: string;
      status?: number;
    } = {},
  ) {
    const db = connect();
    const stmList = db.prepare('SELECT * FROM [dbo.KQ_SysmexXP100]');
    const data = stmList.all();
    return data;
  },
};
