import { CONNECT_TYPE } from 'shared/constants';
import connect from './index';

export default {
  getAll() {
    const db = connect();

    const whereConds = ['kieuketnoi = @kieuketnoi'];
    const whereClause =
      whereConds.length > 0 ? `WHERE ${whereConds.join(' AND ')}` : '';

    const stmList = db.prepare(
      `SELECT * FROM [dbo.connectmanage] ${whereClause} ORDER BY cong ASC`,
    );
    const data = stmList.all({ kieuketnoi: CONNECT_TYPE.SerialPort });
    return data;
  },
};
