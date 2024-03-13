import connect from './index';

export default {
  getAll() {
    try {
      const db = connect();
      const stmTotal = db.prepare(
        'SELECT COUNT(*) total FROM [dbo.connectmanage]',
      );
      const stmList = db.prepare(
        'SELECT * FROM [dbo.connectmanage] ORDER BY cong ASC',
      );

      const total = stmTotal.all();
      const data = stmList.all();
      return { success: true, data, total: total[0].total };
    } catch (error) {
      return { success: false, message: error };
    }
  },
  create(values: any) {
    try {
      const db = connect();
      const currenttime = Date.now();

      const stmAdd = db.prepare(
        `INSERT INTO [dbo.connectmanage] (
          cong,
          comp,
          lab,
          functionname,
          kieuketnoi,
          comport,
          baudrate,
          rtsmode,
          stopbits,
          databits,
          parity,
          readtimeout,
          writetimeout,
          connect,
          ipport,
          autosendhis,
          folder,
          autosendagain,
          ipaddress,
          client,
          closeport,
          bantd,
          sokytubarcode,
          nhapbarcode,
          decimalsymbol,
          createtime,
          updatetime
        )
        VALUES (
          @cong,
          @comp,
          @lab,
          @functionname,
          @kieuketnoi,
          @comport,
          @baudrate,
          @rtsmode,
          @stopbits,
          @databits,
          @parity,
          @readtimeout,
          @writetimeout,
          @connect,
          @ipport,
          @autosendhis,
          @folder,
          @autosendagain,
          @ipaddress,
          @client,
          @closeport,
          @bantd,
          @sokytubarcode,
          @nhapbarcode,
          @decimalsymbol,
          @createtime,
          @updatetime
        )`,
      );
      const result = stmAdd.run({
        cong: values.cong,
        comp: values.comp || 'ADMINCOMPUTER',
        lab: values.lab,
        functionname: values.functionname,
        kieuketnoi: values.kieuketnoi,
        comport: values.comport,
        baudrate: values.baudrate,
        rtsmode: values.rtsmode,
        stopbits: values.stopbits,
        databits: values.databits,
        parity: values.parity,
        readtimeout: values.readtimeout,
        writetimeout: values.writetimeout,
        connect: values.connect,
        ipport: values.ipport,
        autosendhis: values.autosendhis,
        folder: values.folder,
        autosendagain: values.autosendagain,
        ipaddress: values.ipaddress,
        client: values.client,
        closeport: values.closeport,
        bantd: values.bantd,
        sokytubarcode: values.sokytubarcode || 4,
        nhapbarcode: values.nhapbarcode,
        decimalsymbol: values.decimalsymbol || ',',
        createtime: currenttime,
        updatetime: currenttime,
      });

      const id = result.lastInsertRowid;
      const stmQueryById = db.prepare(
        `SELECT * FROM [dbo.connectmanage] WHERE id = @id`,
      );
      const item = stmQueryById.get({ id });

      return { success: true, data: item };
    } catch (error) {
      return { success: false, message: error };
    }
  },
  update(values: any) {
    try {
      const db = connect();
      const currenttime = Date.now();

      const stmUpdate = db.prepare(
        `UPDATE [dbo.connectmanage] SET
          cong = @cong,
          comp = @comp,
          lab = @lab,
          functionname = @functionname,
          kieuketnoi = @kieuketnoi,
          comport = @comport,
          baudrate = @baudrate,
          rtsmode = @rtsmode,
          stopbits = @stopbits,
          databits = @databits,
          parity = @parity,
          readtimeout = @readtimeout,
          writetimeout = @writetimeout,
          connect = @connect,
          ipport = @ipport,
          autosendhis = @autosendhis,
          folder = @folder,
          autosendagain = @autosendagain,
          ipaddress = @ipaddress,
          client = @client,
          closeport = @closeport,
          bantd = @bantd,
          sokytubarcode = @sokytubarcode,
          nhapbarcode = @nhapbarcode,
          decimalsymbol = @decimalsymbol,
          updatetime = @updatetime
        WHERE id = @id`,
      );
      stmUpdate.run({
        id: values.id,
        cong: values.cong,
        comp: values.comp || 'ADMINCOMPUTER',
        lab: values.lab,
        functionname: values.functionname,
        kieuketnoi: values.kieuketnoi,
        comport: values.comport,
        baudrate: values.baudrate,
        rtsmode: values.rtsmode,
        stopbits: values.stopbits,
        databits: values.databits,
        parity: values.parity,
        readtimeout: values.readtimeout,
        writetimeout: values.writetimeout,
        connect: values.connect,
        ipport: values.ipport,
        autosendhis: values.autosendhis,
        folder: values.folder,
        autosendagain: values.autosendagain,
        ipaddress: values.ipaddress,
        client: values.client,
        closeport: values.closeport,
        bantd: values.bantd,
        sokytubarcode: values.sokytubarcode || 4,
        nhapbarcode: values.nhapbarcode,
        decimalsymbol: values.decimalsymbol || ',',
        updatetime: currenttime,
      });

      const stmQueryById = db.prepare(
        `SELECT * FROM [dbo.connectmanage] WHERE id = @id`,
      );
      const item = stmQueryById.get({ id: values.id });

      return { success: true, data: item };
    } catch (error) {
      return { success: false, message: error };
    }
  },
  delete(id: any) {
    try {
      const db = connect();

      const stmQueryById = db.prepare(
        `SELECT * FROM [dbo.connectmanage] WHERE id = @id`,
      );
      const stmDelete = db.prepare(
        `DELETE FROM [dbo.connectmanage] WHERE id = @id`,
      );

      const item = stmQueryById.get({ id });
      if (!item) {
        return { success: false, message: 'Not found' };
      }
      stmDelete.run({ id });
      return { success: true };
    } catch (error) {
      return { success: false, message: error };
    }
  },
};
