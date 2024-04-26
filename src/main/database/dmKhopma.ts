import connect from './index';

export type DmKhopma = {
  lab: string;
  macs: string;
  maxn: string;
};

export default {
  getByLab(lab: string) {
    const db = connect();
    const stmList = db.prepare<any, DmKhopma>(
      'SELECT * FROM [dbo.dmKhopma] WHERE lab = @lab',
    );
    const data = stmList.all({ lab });
    return data;
  },
};
