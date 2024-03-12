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
      cong TEXT NOT NULL, /* tên kết nối */
      comp TEXT NOT NULL, /* tên máy tính */
      lab TEXT NOT NULL,
      functionname TEXT,
      kieuketnoi TEXT,
      comport TEXT,
      baudrate TEXT,
      /* handshake TEXT, */
      rtsmode TEXT,
      stopbits TEXT,
      databits TEXT,
      parity TEXT,
      readtimeout TEXT,
      writetimeout TEXT,
      connect INTEGER NOT NULL,
      ipport TEXT,
      autosendhis INTEGER,
      folder TEXT,
      autosendagain INTEGER,
      ipaddress TEXT,
      client INTEGER,
      closeport INTEGER,
      bantd INTEGER,
      sokytubarcode INTEGER NOT NULL DEFAULT 4,
      nhapbarcode INTEGER,
      decimalsymbol TEXT NOT NULL DEFAULT ",",
      createtime int,
      updatetime int
    )`);
  }
}
