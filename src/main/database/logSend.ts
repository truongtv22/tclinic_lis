import dayjs from 'dayjs';
import connect from './index';
import { parseString } from 'shared/utils/date';

export default {
  columns: [
    'lab',
    'date_time',
    'barcode',
    'barcode_edit',
    'ds_ketqua',
    'message',
  ],

  queryAll(
    params: {
      lab?: string;
      startDate?: string;
      endDate?: string;
      barcode?: string;
    } = {},
  ) {
    const db = connect();

    const whereConds = [];
    const whereValues: any = {};
    if (params.lab) {
      whereConds.push(`lab = @lab`);
      whereValues.lab = params.lab;
    }
    if (params.startDate) {
      whereConds.push(`date_time >= @startDate`);
      whereValues.startDate = parseString(
        dayjs(params.startDate).startOf('day'),
      );
    }
    if (params.endDate) {
      whereConds.push(`date_time <= @endDate`);
      whereValues.endDate = parseString(dayjs(params.endDate).endOf('day'));
    }
    if (params.barcode) {
      whereConds.push(`barcode LIKE @barcode OR barcode_edit LIKE @barcode`);
      whereValues.barcode = `%${params.barcode}%`;
    }

    const whereClause =
      whereConds.length > 0 ? `WHERE ${whereConds.join(' AND ')}` : '';

    const stmTotal = db.prepare(
      `SELECT COUNT(*) total FROM [dbo.LogSend] ${whereClause}`,
    );
    const stmList = db.prepare(
      `SELECT * FROM [dbo.LogSend] ${whereClause} ORDER BY date_time DESC`,
    );

    const total: any = stmTotal.get(whereValues);
    const data = stmList.all(whereValues);

    return { data, total: total.total };
  },

  getById(id: number) {
    const db = connect();
    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.LogSend] WHERE id = @id`,
    );
    const data = stmQueryById.get({ id });
    return data;
  },

  getByLab(lab: string) {
    const db = connect();
    const stmQuery = db.prepare(`SELECT * FROM [dbo.LogSend] WHERE lab = @lab`);
    const data = stmQuery.get({ lab });
    return data;
  },

  getByBarcode(lab: string, barcode: string) {
    const db = connect();
    const stmQuery = db.prepare(
      `SELECT * FROM [dbo.LogSend] WHERE lab = @lab AND barcode = @barcode`,
    );
    const data = stmQuery.get({ lab, barcode });
    return data;
  },

  create(values: any = {}) {
    const db = connect();
    const currentTime = new Date().toISOString();

    const stmAdd = db.prepare(
      `INSERT INTO [dbo.LogSend] (
          ${Object.keys(values)
            .concat('date_time')
            .filter((key) => this.columns.includes(key))
            .map((key) => `${key}`)
            .join(', ')}
        ) VALUES (
          ${Object.keys(values)
            .concat('date_time')
            .filter((key) => this.columns.includes(key))
            .map((key) => `@${key}`)
            .join(', ')}
        )`,
    );
    const result = stmAdd.run({ ...values, date_time: currentTime });

    const id = result.lastInsertRowid;
    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.LogSend] WHERE id = @id`,
    );
    const data = stmQueryById.get({ id });
    return data;
  },

  update(id: number, values: any = {}) {
    const db = connect();
    const currentTime = new Date().toISOString();

    const stmUpdate = db.prepare(
      `UPDATE [dbo.LogSend] SET
          ${Object.keys(values)
            .concat('date_time')
            .filter((key) => this.columns.includes(key))
            .map((key) => `${key} = @${key}`)
            .join(', ')}
        WHERE id = @id`,
    );
    stmUpdate.run({ ...values, id, date_time: currentTime });

    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.LogSend] WHERE id = @id`,
    );
    const data = stmQueryById.get({ id });
    return data;
  },
};
