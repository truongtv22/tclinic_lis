import dayjs from 'dayjs';
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

    const whereConds = [];
    if (params.startDate) whereConds.push(`date_time >= @startDate`);
    if (params.endDate) whereConds.push(`date_time <= @endDate`);
    if (params.barcode) whereConds.push(`barcode LIKE @barcode`);
    if (params.status > -1) whereConds.push(`sendhis = @status`);

    const whereClause =
      whereConds.length > 0 ? `WHERE ${whereConds.join(' AND ')}` : '';

    const startDate = dayjs(params.startDate).startOf('day').toISOString();
    const endDate = dayjs(params.endDate).endOf('day').toISOString();
    const barcode = `%${params.barcode}%`;
    const status = +params.status;

    const stmTotal = db.prepare(
      `SELECT COUNT(*) total FROM [dbo.KQ_BW200] ${whereClause}`,
    );
    const stmList = db.prepare(
      `SELECT * FROM [dbo.KQ_BW200] ${whereClause} ORDER BY date_time DESC`,
    );

    const total: any = stmTotal.get({ startDate, endDate, barcode, status });
    const data = stmList.all({ startDate, endDate, barcode, status });

    return { data, total: total.total };
  },
  create(values: any = {}) {
    const db = connect();

    const stmAdd = db.prepare(
      `INSERT INTO [dbo.KQ_BW200] (
          date_time,
          barcode,
          URO,
          BIL,
          KET,
          BLD,
          PRO,
          NIT,
          LEU,
          GLU,
          SG,
          PH,
          VC
        ) VALUES (
          @date_time,
          @barcode,
          @URO,
          @BIL,
          @KET,
          @BLD,
          @PRO,
          @NIT,
          @LEU,
          @GLU,
          @SG,
          @PH,
          @VC
        )`,
    );
    const result = stmAdd.run(values);

    const id = result.lastInsertRowid;
    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.KQ_BW200] WHERE id = @id`,
    );
    const data = stmQueryById.get({ id });
    return data;
  },
  update(id: number, values: any) {
    const db = connect();

    const stmUpdate = db.prepare(
      `UPDATE [dbo.KQ_BW200] SET
          sendhis = @sendhis,
        WHERE id = @id`,
    );
    stmUpdate.run({ id, sendhis: values.sendhis });

    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.KQ_BW200] WHERE id = @id`,
    );
    const data = stmQueryById.get({ id });
    return data;
  },
};
