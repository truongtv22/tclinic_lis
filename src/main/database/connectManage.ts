import { CONNECT_TYPE } from 'shared/constants';
import connect from './index';

export default {
  columns: [
    'active',
    'cong',
    'comp',
    'lab',
    'functionname',
    'kieuketnoi',
    'comport',
    'baudrate',
    'rtsmode',
    'stopbits',
    'databits',
    'parity',
    'readtimeout',
    'writetimeout',
    'connect',
    'ipport',
    'autosendhis',
    'folder',
    'autosendagain',
    'ipaddress',
    'client',
    'closeport',
    'bantd',
    'sokytubarcode',
    'nhapbarcode',
    'decimalsymbol',
    'loaidongbo',
    'createtime',
    'updatetime',
  ],

  getAll() {
    const db = connect();

    const whereConds: any = [
      /* 'kieuketnoi = @kieuketnoi' */
    ];
    const whereClause =
      whereConds.length > 0 ? `WHERE ${whereConds.join(' AND ')}` : '';

    const stmList = db.prepare(
      `SELECT * FROM [dbo.connectManage] ${whereClause} ORDER BY cong ASC`,
    );
    const data = stmList.all({ kieuketnoi: CONNECT_TYPE.SerialPort });
    return data;
  },

  getById(id: number) {
    const db = connect();

    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.connectManage] WHERE id = @id`,
    );
    const data = stmQueryById.get({ id });
    return data;
  },

  create(values: any = {}) {
    const db = connect();
    const currentTime = new Date().toISOString();

    const stmQuery = db.prepare(
      `SELECT * FROM [dbo.connectManage] WHERE comport LIKE @comport`,
    );
    const listByQuery = stmQuery.all({ comport: values.comport });
    if (listByQuery.length > 0) {
      throw new Error('ComPort đã được sử dụng');
    }

    const stmAdd = db.prepare(
      `INSERT INTO [dbo.connectManage] (
          ${Object.keys(values)
            .filter((key) => this.columns.includes(key))
            .map((key) => `${key}`)
            .join(', ')}
        ) VALUES (
          ${Object.keys(values)
            .filter((key) => this.columns.includes(key))
            .map((key) => `@${key}`)
            .join(', ')}
        )`,
    );
    const result = stmAdd.run({
      ...values,
      createtime: currentTime,
      updatetime: currentTime,
    });

    const id = result.lastInsertRowid;
    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.connectManage] WHERE id = @id`,
    );
    const data = stmQueryById.get({ id });
    return data;
  },

  update(id: number, values: any = {}) {
    const db = connect();
    const currentTime = new Date().toISOString();

    const stmQuery = db.prepare(
      `SELECT * FROM [dbo.connectManage] WHERE id != @id AND comport LIKE @comport`,
    );
    const listByQuery = stmQuery.all({ id, comport: values.comport });
    if (listByQuery.length > 0) {
      throw new Error('ComPort đã được sử dụng');
    }

    const stmUpdate = db.prepare(
      `UPDATE [dbo.connectManage] SET
          ${Object.keys(values)
            .filter((key) => this.columns.includes(key))
            .map((key) => `${key} = @${key}`)
            .join(', ')}
        WHERE id = @id`,
    );
    stmUpdate.run({
      ...values,
      id,
      updatetime: currentTime,
    });

    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.connectManage] WHERE id = @id`,
    );
    const data = stmQueryById.get({ id });
    return data;
  },

  delete(id: number) {
    const db = connect();

    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.connectManage] WHERE id = @id`,
    );
    const stmDelete = db.prepare(
      `DELETE FROM [dbo.connectManage] WHERE id = @id`,
    );

    const data = stmQueryById.get({ id });
    if (!data) {
      throw new Error('Không tìm thấy dữ liệu');
    }
    stmDelete.run({ id });
  },
};
