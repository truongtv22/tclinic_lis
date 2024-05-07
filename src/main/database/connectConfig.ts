import connect from './index';

export default {
  format(data: any) {
    if (data) {
      data.rtscts = !!data.rtscts;
      data.xon = !!data.xon;
      data.xoff = !!data.xoff;
      data.xany = !!data.xany;
      data.brk = !!data.brk;
      data.cts = !!data.cts;
      data.dsr = !!data.dsr;
      data.dtr = !!data.dtr;
      data.rts = !!data.rts;
    }
    return data;
  },

  parse(data: any) {
    if (data) {
      data.rtscts = data.rtscts ? 1 : 0;
      data.xon = data.xon ? 1 : 0;
      data.xoff = data.xoff ? 1 : 0;
      data.xany = data.xany ? 1 : 0;
      data.brk = data.brk ? 1 : 0;
      data.cts = data.cts ? 1 : 0;
      data.dsr = data.dsr ? 1 : 0;
      data.dtr = data.dtr ? 1 : 0;
      data.rts = data.rts ? 1 : 0;
    }
    return data;
  },

  getById(connectId: number) {
    const db = connect();

    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.connectConfig] WHERE connect_id = @connectId`,
    );
    const data = stmQueryById.get({ connectId });
    return this.format(data);
  },

  update(connectId: number, values: any = {}) {
    const db = connect();

    const stmUpdate = db.prepare(
      `INSERT OR REPLACE INTO [dbo.connectConfig] (
          connect_id,
          rtscts,
          xon,
          xoff,
          xany,
          brk,
          cts,
          dsr,
          dtr,
          rts
        ) VALUES (
          @connectId,
          @rtscts,
          @xon,
          @xoff,
          @xany,
          @brk,
          @cts,
          @dsr,
          @dtr,
          @rts
        )`,
    );
    values = this.parse(values);
    stmUpdate.run({
      connectId,
      rtscts: values.rtscts,
      xon: values.xon,
      xoff: values.xoff,
      xany: values.xany,
      brk: values.brk,
      cts: values.cts,
      dsr: values.dsr,
      dtr: values.dtr,
      rts: values.rts,
    });

    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.connectConfig] WHERE connect_id = @connectId`,
    );
    const data: any = stmQueryById.get({ connectId });
    return this.format(data);
  },

  delete(connectId: number) {
    const db = connect();

    const stmQueryById = db.prepare(
      `SELECT * FROM [dbo.connectConfig] WHERE connect_id = @connectId`,
    );
    const stmDelete = db.prepare(
      `DELETE FROM [dbo.connectConfig] WHERE connect_id = @connectId`,
    );

    const data = stmQueryById.get({ connectId });
    if (data) {
      stmDelete.run({ connectId });
    }
  },
};
