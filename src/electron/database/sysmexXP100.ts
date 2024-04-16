import connect from './index';

export default {
  create(values: any = {}) {
    const db = connect();

    const stmAdd = db.prepare(``);
  },
};
