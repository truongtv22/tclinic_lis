import Sqlite from 'better-sqlite3';

let db: Sqlite.Database;

export default function connect() {
  const conn = new Sqlite('tclinic-lis.db', { verbose: console.log });
  return conn
}

export function initDatabase() {
  db = connect();

  const stmAllTable = db.prepare(
    `select name from sqlite_master where type='table' order by name`,
  );
  const tables = stmAllTable.all()?.map((item: any) => item.name);

  if (!tables.includes('device')) {
    db.exec(`create table if not exists device (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name varchar(500),
      createTime int,
      updateTime int
    )`);
  }

  if (!tables.includes('dbo.connectmanage')) {
    db.exec(`create table if not exists [dbo.connectmanage] (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      cong TEXT, /* tên kết nối */
      comp TEXT, /* tên máy tính */
      lab TEXT,
      functionname TEXT,
      kieuketnoi TEXT,
      comport TEXT,
      baudrate INTEGER,
      rtsmode TEXT,
      stopbits INTEGER,
      databits INTEGER,
      parity TEXT,
      readtimeout INTEGER,
      writetimeout INTEGER,
      connect INTEGER,
      ipport TEXT,
      autosendhis INTEGER,
      folder TEXT,
      autosendagain INTEGER,
      ipaddress TEXT,
      client INTEGER,
      closeport INTEGER,
      bantd INTEGER,
      sokytubarcode INTEGER DEFAULT 4,
      nhapbarcode INTEGER,
      decimalsymbol TEXT DEFAULT ",",
      createtime int,
      updatetime int
    )`);
  }
}
