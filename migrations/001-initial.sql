--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS [dbo.connectManage] (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  active INTEGER, -- trạng thái hoạt động
  cong TEXT, -- tên kết nối
  comp TEXT, -- tên máy tính
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
  loaidongbo TEXT DEFAULT "",
  createtime TEXT,
  updatetime TEXT
);

INSERT INTO [dbo.connectManage] (id, active, cong, comp, lab, functionname, kieuketnoi, comport, baudrate, rtsmode, stopbits, databits, parity, readtimeout, writetimeout, connect, ipport, autosendhis, folder, autosendagain, ipaddress, client, closeport, bantd, sokytubarcode, nhapbarcode, decimalsymbol, loaidongbo, createtime, updatetime) VALUES (1, 0, NULL, 'Máy XN nước tiểu BW200', 'BW200', NULL, 'SerialPort', 'COM3', 4800, 'handshake', 1, 8, 'none', NULL, NULL, NULL, NULL, 1, NULL, '', NULL, NULL, NULL, NULL, 4, NULL, ',', 'ONE', '2024-04-26T15:35:04.570Z', '2024-05-27T09:30:51.262Z');
INSERT INTO [dbo.connectManage] (id, active, cong, comp, lab, functionname, kieuketnoi, comport, baudrate, rtsmode, stopbits, databits, parity, readtimeout, writetimeout, connect, ipport, autosendhis, folder, autosendagain, ipaddress, client, closeport, bantd, sokytubarcode, nhapbarcode, decimalsymbol, loaidongbo, createtime, updatetime) VALUES (2, 0, NULL, 'Máy xét nghiệm miễn dịch Access 2', 'Access2', NULL, 'SerialPort', 'COM2', 9600, 'handshake', 1, 8, 'none', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, ',', '', '2024-04-26T22:56:10.006Z', '2024-05-27T09:31:05.460Z');
INSERT INTO [dbo.connectManage] (id, active, cong, comp, lab, functionname, kieuketnoi, comport, baudrate, rtsmode, stopbits, databits, parity, readtimeout, writetimeout, connect, ipport, autosendhis, folder, autosendagain, ipaddress, client, closeport, bantd, sokytubarcode, nhapbarcode, decimalsymbol, loaidongbo, createtime, updatetime) VALUES (3, 0, NULL, 'Máy xét nghiệm huyết học Sysmex XP 100', 'SysmexXP100', NULL, 'SerialPort', 'COM4', 9600, 'handshake', 1, 8, 'none', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, ',', '', '2024-04-26T22:58:06.329Z', '2024-05-23T08:05:14.725Z');
INSERT INTO [dbo.connectManage] (id, active, cong, comp, lab, functionname, kieuketnoi, comport, baudrate, rtsmode, stopbits, databits, parity, readtimeout, writetimeout, connect, ipport, autosendhis, folder, autosendagain, ipaddress, client, closeport, bantd, sokytubarcode, nhapbarcode, decimalsymbol, loaidongbo, createtime, updatetime) VALUES (4, 0, NULL, 'Máy xét nghiệm sinh hóa Bio System A15', 'BioSystemA15', NULL, 'Folder', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '/Users/tatruong/Desktop', NULL, NULL, NULL, NULL, NULL, 4, NULL, ',', '', '2024-04-26T22:58:17.966Z', '2024-05-08T16:32:50.844Z');

CREATE TABLE IF NOT EXISTS [dbo.connectConfig] (
  connect_id INTEGER PRIMARY KEY NOT NULL,
  rtscts INTEGER DEFAULT 0,
  xon INTEGER DEFAULT 0,
  xoff INTEGER DEFAULT 0,
  xany INTEGER DEFAULT 0,
  brk INTEGER DEFAULT 0,
  cts INTEGER DEFAULT 0,
  dsr INTEGER DEFAULT 0,
  dtr INTEGER DEFAULT 1,
  rts INTEGER DEFAULT 1,
  FOREIGN KEY (connect_id) REFERENCES [dbo.connectManage] (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS [dbo.dmKhopma] (
  lab TEXT NOT NULL,
  macs TEXT NOT NULL,
  maxn TEXT NOT NULL,
  PRIMARY KEY (lab, macs, maxn)
);

INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('BW200', '6551d70b6c0f051e16f19f37', 'VC');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('BW200', '6551d70b6c0f051e16f19f36', 'GLU');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('BW200', '6551d70b6c0f051e16f19f35', 'BIL');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('BW200', '6551d70b6c0f051e16f19f34', 'KET');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('BW200', '6551d70b6c0f051e16f19f33', 'SG');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('BW200', '6551d70b6c0f051e16f19f32', 'BLD');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('BW200', '6551d70b6c0f051e16f19f31', 'PH');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('BW200', '6551d70b6c0f051e16f19f30', 'PRO');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('BW200', '6551d70b6c0f051e16f19f2f', 'URO');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('BW200', '6551d70b6c0f051e16f19f2e', 'NIT');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('BW200', '6551d70b6c0f051e16f19f2d', 'LEU');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f2b', 'PAPPA');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f12', 'TotT3');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f13', 'FRT4');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f14', 'TSH');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f17', 'PRL');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f19', 'HCG5');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f1b', 'OV125Ag');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f1c', 'BR153Ag');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f1e', ' ');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f1f', 'PSAHyb');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f21', 'AFP');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f24', 'Ferritin');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f25', ' ');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f26', 'AFP');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f27', 'HCG5');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f28', 'uE3');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f29', ' ');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('Access2', '6551d70b6c0f051e16f19f2a', 'HCG5');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19ef2', 'RBC');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19ef3', 'HGB');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19ef4', 'HCT');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19ef5', 'MCV');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19ef6', 'MCH');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19ef7', 'MCHC');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19efa', 'PLT');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19efb', 'WBC');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19efc', 'NEUTpt');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19efd', 'MXDpt');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19efe', 'LYMpt');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fba', 'RBC');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fc5', 'HGB');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fc6', 'HCT');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fc7', 'MCV');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fc8', 'MCH');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fc9', 'MCHC');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fca', 'RDWsd');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fcb', 'RDWcv');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fcc', 'WBC');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fcd', 'NEUT');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fce', 'MXD');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fd0', 'LYM');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fd1', 'NEUTpt');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fd2', 'MXDpt');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fd3', 'LYMpt');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fd4', 'PLT');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fd5', 'MPV');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fd6', 'PCT');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fd7', 'PDW');
INSERT INTO [dbo.dmKhopma] (lab, macs, maxn) VALUES ('SysmexXP100', '6551d70b6c0f051e16f19fd8', 'PLCR');

CREATE TABLE IF NOT EXISTS [dbo.tbl_MaOnline] (
  lab TEXT NOT NULL,
  ma TEXT NOT NULL,
  ma_online TEXT NOT NULL,
  PRIMARY KEY (lab, ma)
);

INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'AFP', 'AFP');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'BR153Ag', 'BR15-3Ag');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'Ferritin', 'Ferritin');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'FRT4', 'FRT4');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'HCG5', 'HCG5');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'HCG5d', 'HCG5d');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'OV125Ag', 'OV125Ag');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'PAPPA', 'PAPPA');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'PRL', 'PRL');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'PSAHyb', 'PSAHyb');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'TotT3', 'TotT3');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'TSH', 'TSH3');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('Access2', 'uE3', 'uE3');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BW200', 'BIL', 'BIL');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BW200', 'BLD', 'BLD');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BW200', 'GLU', 'GLU');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BW200', 'KET', 'KET');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BW200', 'LEU', 'LEU');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BW200', 'NIT', 'NIT');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BW200', 'PH', 'PH');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BW200', 'PRO', 'PRO');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BW200', 'SG', 'SG');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BW200', 'URO', 'URO');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BW200', 'VC', 'VC');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'HCT', 'HCT');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'HGB', 'HGB');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'LYM', 'LYM#');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'LYMpt', 'LYM%');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'MCH', 'MCH');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'MCHC', 'MCHC');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'MCV', 'MCV');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'MPV', 'MPV');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'MXD', 'MXD#');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'MXDpt', 'MXD%');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'NEUT', 'NEUT#');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'NEUTpt', 'NEUT%');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'PCT', 'PCT');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'PDW', 'PDW');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'PLCR', 'P-LCR');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'PLT', 'PLT');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'RBC', 'RBC');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'RDWcv', 'RDW-CD');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'RDWsd', 'RDW-SD');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('SysmexXP100', 'WBC', 'WBC');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BioSystemA15', 'ALB', 'Albumin');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BioSystemA15', 'ALT', 'ALT');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BioSystemA15', 'AST', 'AST');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BioSystemA15', 'CHOLESTEROL', 'CHOLESTEROL');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BioSystemA15', 'CREATININE', 'CREATININE');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BioSystemA15', 'GGT', 'g-GT');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BioSystemA15', 'GLUCOSE', 'GLUCOSE');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BioSystemA15', 'PROTEIN', 'PROTEIN');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BioSystemA15', 'TRIGLYCERIDES', 'TRIGLYCERIDES');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BioSystemA15', 'UREA', 'UREA UV');
INSERT INTO [dbo.tbl_MaOnline] (lab, ma, ma_online) VALUES ('BioSystemA15', 'URIC', 'URIC');

CREATE TABLE IF NOT EXISTS [dbo.LogSend] (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  lab TEXT,
  date_time TEXT,
  barcode TEXT, -- mã barcode
  barcode_edit TEXT,
  ds_ketqua TEXT,
  message TEXT
);

CREATE TABLE IF NOT EXISTS [dbo.KQ_BW200] (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  date_time TEXT,
  barcode TEXT, -- mã barcode
  sendhis INTEGER DEFAULT 0, -- flag send HIS
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
);

CREATE TABLE IF NOT EXISTS [dbo.KQ_Access2] (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  date_time TEXT,
  barcode TEXT, -- mã barcode
  sendhis INTEGER DEFAULT 0, -- flag send HIS
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
);

CREATE TABLE IF NOT EXISTS [dbo.KQ_SysmexXP100] (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  date_time TEXT,
  barcode TEXT, -- mã barcode
  sendhis INTEGER DEFAULT 0, -- flag send HIS
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
);

CREATE TABLE IF NOT EXISTS [dbo.KQ_BioSystemA15] (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  date_time TEXT,
  barcode TEXT, -- mã barcode
  sendhis INTEGER DEFAULT 0, -- flag send HIS
  barcode_edit TEXT,
  CREATININE TEXT,
  UREA TEXT,
  ALT TEXT,
  AST TEXT,
  GLUCOSE TEXT,
  GGT TEXT,
  TRIGLYCERIDES TEXT,
  CHOLESTEROL TEXT,
  URIC TEXT,
  PROTEIN TEXT,
  ALB TEXT
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE IF EXISTS [dbo.connectManage];

DROP TABLE IF EXISTS [dbo.connectConfig];

DROP TABLE IF EXISTS [dbo.dmKhopma];

DROP TABLE IF EXISTS [dbo.tbl_MaOnline];

DROP TABLE IF EXISTS [dbo.LogSend];

DROP TABLE IF EXISTS [dbo.KQ_BW200];

DROP TABLE IF EXISTS [dbo.KQ_Access2];

DROP TABLE IF EXISTS [dbo.KQ_SysmexXP100];

DROP TABLE IF EXISTS [dbo.KQ_BioSystemA15];
