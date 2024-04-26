import { CONNECT_TYPE } from 'shared/constants';
import connect from './index';

export default {
  getAll() {
    const db = connect();

    const whereConds = ['kieuketnoi = @kieuketnoi'];
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
        ) VALUES (
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
      comp: values.comp,
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
      id,
      cong: values.cong,
      comp: values.comp,
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
