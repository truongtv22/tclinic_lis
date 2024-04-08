import connect from './index';

export default {
  getAll() {
    try {
      const db = connect();
      const stmTotal = db.prepare(
        'SELECT COUNT(*) total FROM [dbo.KQ_BW200]',
      );
      const stmList = db.prepare(
        'SELECT * FROM [dbo.KQ_BW200] ORDER BY datetime ASC',
      );

      const total: any = stmTotal.all();
      const data = stmList.all();
      return { success: true, data, total: total[0].total };
    } catch (error) {
      return { success: false, message: error };
    }
  },
  create(values: any = {}) {
    try {
      const db = connect();

      const stmAdd = db.prepare(
        `INSERT INTO [dbo.KQ_BW200] (
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
          VC,
          datetime
        ) VALUES (
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
          @VC,
          @datetime
        )`,
      );
      const result = stmAdd.run(values);

      const id = result.lastInsertRowid;
      const stmQueryById = db.prepare(
        `SELECT * FROM [dbo.KQ_BW200] WHERE id = @id`,
      );
      const item = stmQueryById.get({ id });

      return { success: true, data: item };
    } catch (error) {
      return { success: false, message: error };
    }
  },
  patch(id: number, values: any) {
    try {
      const db = connect();

      const stmUpdate = db.prepare(
        `UPDATE [dbo.KQ_BW200] SET
          sendhis = @sendhis,
        WHERE id = @id`,
      );
      stmUpdate.run({
        id,
        sendhis: values.sendhis,
      });

      const stmQueryById = db.prepare(
        `SELECT * FROM [dbo.KQ_BW200] WHERE id = @id`,
      );
      const item = stmQueryById.get({ id });

      return { success: true, data: item };
    } catch (error) {
      return { success: false, message: error };
    }
  },
};
