import connect from './index';

export default {
  getByLab(lab: string) {
    const db = connect();
    const stmList = db.prepare(
      `SELECT * FROM [dbo.tbl_MaOnline] WHERE lab = @lab`,
    );
    const data = stmList.all({ lab });
    return data;
  },

  getByMa(lab: string, ma: string) {
    const db = connect();
    const stmQuery = db.prepare(
      `SELECT * FROM [dbo.tbl_MaOnline] WHERE lab = @lab AND ma_online = @ma`,
    );
    const data = stmQuery.get({ lab, ma });
    return data;
  },
};
