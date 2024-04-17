import { app } from 'electron';
import path from 'path';
import Sqlite from 'better-sqlite3';

let db: Sqlite.Database;

export default function connect() {
  const conn = new Sqlite(
    path.join(app.getPath('userData'), 'tclinic-lis.db'),
    { verbose: console.log },
  );
  return conn;
}

export function initDatabase() {
  db = connect();

  const stmAllTable = db.prepare(
    `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`,
  );
  const tables = stmAllTable.all()?.map((item: any) => item.name);

  if (!tables.includes('dbo.connectmanage')) {
    db.exec(`CREATE TABLE IF NOT EXISTS [dbo.connectmanage] (
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
    db.exec(`CREATE TABLE IF NOT EXISTS [dbo.dmkhopma] (
      lab TEXT NOT NULL,
      macs TEXT NOT NULL,
      maxn TEXT NOT NULL,
      PRIMARY KEY (lab, macs, maxn)
    )`);
  }

  if (!tables.includes('dbo.tbl_MaOnline')) {
    db.exec(`CREATE TABLE IF NOT EXISTS [dbo.tbl_MaOnline] (
      lab TEXT NOT NULL,
      ma TEXT NOT NULL,
      ma_online TEXT NOT NULL,
      PRIMARY KEY (lab, ma)
    )`);

    db.exec(`INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','AFP','AFP');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','BR153Ag','BR15-3Ag');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','Ferritin','Ferritin');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','FRT4','FRT4');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','HCG5','HCG5');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','HCG5d','HCG5d');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','OV125Ag','OV125Ag');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','PAPPA','PAPPA');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','PRL','PRL');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','PSAHyb','PSAHyb');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','TotT3','TotT3');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','TSH','TSH3');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('Access2','uE3','uE3');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('BW200','BIL','BIL');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('BW200','BLD','BLD');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('BW200','GLU','GLU');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('BW200','KET','KET');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('BW200','LEU','LEU');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('BW200','NIT','NIT');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('BW200','PH','PH');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('BW200','PRO','PRO');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('BW200','SG','SG');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('BW200','URO','URO');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('BW200','VC','VC');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','HCT','HCT');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','HGB','HGB');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','LYM','LYM#');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','LYMpt','LYM%');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','MCH','MCH');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','MCHC','MCHC');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','MCV','MCV');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','MPV','MPV');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','MXD','MXD#');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','MXDpt','MXD%');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','NEUT','NEUT#');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','NEUTpt','NEUT%');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','PCT','PCT');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','PDW','PDW');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','PLCR','P-LCR');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','PLT','PLT');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','RBC','RBC');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','RDWcv','RDW-CD');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','RDWsd','RDW-SD');
      INSERT INTO "dbo.tbl_MaOnline" (lab, ma, ma_online) VALUES ('SysmexXP100','WBC','WBC');`);
  }

  if (!tables.includes('dbo.KQ_BW200')) {
    db.exec(`create table if not exists [dbo.KQ_BW200] (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      date_time TEXT,
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
      date_time TEXT,
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

  if (!tables.includes('dbo.KQ_SysmexXP100')) {
    db.exec(`create table if not exists [dbo.KQ_SysmexXP100] (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      date_time TEXT,
      barcode TEXT, /* mã barcode */
      sendhis INTEGER DEFAULT 0, /* flag send HIS */
      barcode_edit TEXT,
      WBC TEXT,
      RBC TEXT,
      HGB TEXT,
      HCT TEXT,
      MCV TEXT,
      MCH TEXT,
      MCHC TEXT,
      PLT TEXT,
      LYMpt TEXT,
      MXDpt TEXT,
      NEUTpt TEXT,
      LYM TEXT,
      MXD TEXT,
      NEUT TEXT,
      RDWsd TEXT,
      RDWcv TEXT,
      PDW TEXT,
      MPV TEXT,
      PLCR TEXT,
      PCT TEXT
    )`);
  }
}
