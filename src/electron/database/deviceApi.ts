import connect from './index';

export default {
  getDevice() {
    const db = connect();

    const stmTotal = db.prepare('select count(*) total from device');
    const stmList = db.prepare('select * from device ORDER BY createTime ASC');

    try {
      const total = stmTotal.all();
      const data = stmList.all();
      return { success: true, data, total };
    } catch (error) {
      return { success: false, msg: error };
    }
  },
  addDevice({ name }: any) {
    const db = connect();
    const createTime = Date.now();

    const stmAdd = db.prepare(
      `INSERT INTO device (name, createTime, updateTime) values (@name, @createTime, @updateTime)`,
    );

    try {
      stmAdd.run({ name, createTime, updateTime: createTime });
      return { success: true };
    } catch (error) {
      return { success: false, msg: error };
    }
  },
};
