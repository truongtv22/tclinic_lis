import Sqlite from 'better-sqlite3';

let db: Sqlite.Database;

export default function connect() {
  const conn = new Sqlite('tclinic-lis.db', { verbose: console.log });
  return conn;
}

export function initDatabase() {
  db = connect();

  const stmAllTable = db.prepare(
    `select name from sqlite_master where type='table' order by name`,
  );
  const tables = stmAllTable.all()?.map((item: any) => item.name);

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
      loaidongbo INTEGER DEFAULT 0,
      createtime TEXT,
      updatetime TEXT
    )`);
  }

  if (!tables.includes('dbo.dmkhopma')) {
    db.exec(`create table if not exists [dbo.dmkhopma] (
      lab TEXT NOT NULL,
      macs TEXT NOT NULL,
      maxn TEXT NOT NULL,
      PRIMARY KEY (lab, macs, maxn)
    )`);
  }

  if (!tables.includes('dbo.KQ_BW200')) {
    db.exec(`create table if not exists [dbo.KQ_BW200] (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      datetime TEXT,
      barcode TEXT, /* mã barcode */
      sendhis INTEGER DEFAULT 0, /* flag send HIS */
      barcode_edit TEXT,
      URO TEXT,
      BIL TEXT,
      KET TEXT,
      BLD TEXT,
      PRO TEXT,
      NIT TEXT,
      LEU TEXT,
      GLU TEXT,
      SG TEXT,
      PH TEXT,
      VC TEXT
    )`);
  }

  if (!tables.includes('dbo.KQ_Access2')) {
    db.exec(`create table if not exists [dbo.KQ_Access2] (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      datetime TEXT,
      barcode TEXT, /* mã barcode */
      sendhis INTEGER DEFAULT 0, /* flag send HIS */
      barcode_edit TEXT,
      PAPPA TEXT,
      AFP TEXT,
      BR153Ag TEXT,
      Ferritin TEXT,
      FRT4 TEXT,
      HCG5 TEXT,
      OV125Ag TEXT,
      PRL TEXT,
      PSAHyb TEXT,
      TotT3 TEXT,
      TSH TEXT,
      uE3 TEXT,
      HCG5d TEXT
    )`);
  }
}
