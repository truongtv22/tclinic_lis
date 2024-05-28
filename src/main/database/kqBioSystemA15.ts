import dayjs from 'dayjs';
import { parseString } from 'shared/utils/date';
import connect from './index';

export default {
  columns: [
    'date_time',
    'barcode',
    'sendhis',
    'barcode_edit',
    'CREATININE',
    'UREA',
    'ALT',
    'AST',
    'GLUCOSE',
    'GGT',
    'TRIGLYCERIDES',
    'CHOLESTEROL',
    'URIC',
    'PROTEIN',
    'ALB',
  ],

  queryAll(
    params: {
      startDate?: string;
      endDate?: string;
      barcode?: string;
      status?: number;
    } = {},
  ) {
    const db = connect();

    const whereConds = [];
    const whereValues: any = {};
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
    if (params.status > -1) {
      whereConds.push(`sendhis = @status`);
      whereValues.status = +params.status;
    }

    const whereClause =
      whereConds.length > 0 ? `WHERE ${whereConds.join(' AND ')}` : '';

    const stmTotal = db.prepare(
      `SELECT COUNT(*) total FROM [dbo.KQ_BioSystemA15] ${whereClause}`,
    );
    const stmList = db.prepare(
      `SELECT * FROM [dbo.KQ_BioSystemA15] ${whereClause} ORDER BY date_time DESC`,
    );

    const total: any = stmTotal.get(whereValues);
    const data = stmList.all(whereValues);

    return { data, total: total.total };
  },

  create(values: any = {}) {
    const db = connect();

    const stmAdd = db.prepare(
      `INSERT INTO [dbo.KQ_BioSystemA15] (
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
    const result = stmAdd.run(values);

    const id = result.lastInsertRowid;
    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.KQ_BioSystemA15] WHERE id = @id`,
    );
    const data = stmQueryById.get({ id });
    return data;
  },

  update(id: number, values: any) {
    const db = connect();

    const stmUpdate = db.prepare(
      `UPDATE [dbo.KQ_BioSystemA15] SET
          ${Object.keys(values)
            .filter((key) => this.columns.includes(key))
            .map((key) => `${key} = @${key}`)
            .join(', ')}
        WHERE id = @id`,
    );
    stmUpdate.run({ ...values, id });

    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.KQ_BioSystemA15] WHERE id = @id`,
    );
    const data = stmQueryById.get({ id });
    return data;
  },

  delete(id: number) {
    const db = connect();

    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.KQ_BioSystemA15] WHERE id = @id`,
    );
    const stmDelete = db.prepare(
      `DELETE FROM [dbo.KQ_BioSystemA15] WHERE id = @id`,
    );

    const data = stmQueryById.get({ id });
    if (!data) {
      throw new Error('Không tìm thấy dữ liệu');
    }
    stmDelete.run({ id });
  },
};
