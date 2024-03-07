import Database from 'better-sqlite3';

let db: any;

export default function connect() {
  const conn = new Database('tclinic-lis.db', { verbose: console.log });
  return conn
}

export function initDatabase() {
  db = connect();

  const stmAllTable = db.prepare(
    `select name from sqlite_master where type='table' order by name`,
  );
  const tables = stmAllTable.all()?.map((item: any) => item.name);
  console.log('tables', tables);

  if (!tables.includes('device')) {
    db.exec(`create table if not exists device (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name varchar(500),
      createTime int,
      updateTime int
    )`);
  }
}
