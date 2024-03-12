import connect from './index';

export default {
  getAll() {
    const db = connect();

    const stmTotal = db.prepare(
      'SELECT COUNT(*) total FROM [dbo.connectmanage]',
    );
    const stmList = db.prepare(
      'SELECT * FROM [dbo.connectmanage] ORDER BY cong ASC',
    );

    try {
      const total = stmTotal.all();
      const data = stmList.all();
      return { success: true, data, total: total[0].total };
    } catch (error) {
      return { success: false, message: error };
    }
  },
  create(values: any) {
    const db = connect();
    const createtime = Date.now();

    const stmAdd = db.prepare(
      `INSERT INTO [dbo.connectmanage] (
        cong,
        comp,
        lab,
        functionname,
        kieuketnoi,
        comport,
        baudrate,
        /* handshake, */
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
        @createtime,
        @updatetime
      )`,
    );

    try {
      // stmAdd.run({
      //   cong: values.cong,
      //   comp: values.comp || 'ADMINCOMPUTER',
      //   lab: values.lab,
      //   functionname: values.functionname,
      //   kieuketnoi: values.kieuketnoi,
      //   comport: values.comport,
      //   baudrate: values.baudrate,
      //   // handshake: values.handshake,
      //   rtsmode: values.rtsmode,
      //   stopbits: values.stopbits,
      //   databits: values.databits,
      //   parity: values.parity,
      //   readtimeout: values.readtimeout,
      //   writetimeout: values.writetimeout,
      //   connect: values.connect,
      //   ipport: values.ipport,
      //   autosendhis: values.autosendhis,
      //   folder: values.folder,
      //   autosendagain: values.autosendagain,
      //   ipaddress: values.ipaddress,
      //   client: values.client,
      //   closeport: values.closeport,
      //   bantd: values.bantd,
      //   sokytubarcode: values.sokytubarcode || 4,
      //   nhapbarcode: values.nhapbarcode,
      //   decimalsymbol: values.decimalsymbol || ',',
      //   createtime,
      //   updatetime: createtime,
      // });
      return { success: true };
    } catch (error) {
      return { success: false, message: error };
    }
  },
};
