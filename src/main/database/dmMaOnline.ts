import connect from './index';

export default {
  getByLab(lab: string) {
    const db = connect();
    const stmList = db.prepare(
      'SELECT * FROM [dbo.tbl_MaOnline] WHERE lab = @lab',
    );
    const data = stmList.all({ lab });
    return data;
  },
};
