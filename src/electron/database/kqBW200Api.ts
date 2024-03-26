import connect from './index';

export default {
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
      return { success: false, msg: error };
    }
  },
};
