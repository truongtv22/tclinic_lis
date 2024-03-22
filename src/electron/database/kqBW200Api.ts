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
      stmAdd.run(values);
      return { success: true };
    } catch (error) {
      return { success: false, msg: error };
    }
  },
};
