import Database from "better-sqlite3";

let db: any;

export default function connect() {
  const conn = new Database("tcliniclis.db", { verbose: console.log });
  console.log("111111", conn);
  return conn;
}

export function initDatabase() {
  db = connect();

  const stmAllTable = db.prepare(`select name from sqlite_master where type='table' order by name`);
  const tables = stmAllTable.all()?.map((item: any) => item.name);
  console.log("tables", tables);

  if (!tables.includes("device")) {
    db.exec(`create table if not exists device (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name varchar(500),
      createTime int,
      updateTime int
    )`);
  }

  if (!tables.includes("category_table")) {
    db.exec(`create table if not exists category_table (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name varchar(500),
      remark varchar(500),
      createTime int,
      sort int
    )`);
  }
}
