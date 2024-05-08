import { ProColumns } from '@ant-design/pro-components';
import { Table } from 'antd';

import kqSysmexXP100Service from 'renderer/services/kqSysmexXP100';
import { LabConfig, BARCODE_COLUMNN, THOIGIAN_COLUMNN } from './LabConfig';

export type SysmexXP100Data = {
  id: number;
  date_time: string;
  barcode: string;
  sendhis: number;
  WBC: string;
  RBC: string;
  HGB: string;
  HCT: string;
  MCV: string;
  MCH: string;
  MCHC: string;
  PLT: string;
  LYMpt: string;
  MXDpt: string;
  NEUTpt: string;
  LYM: string;
  MXD: string;
  NEUT: string;
  RDWsd: string;
  RDWcv: string;
  PDW: string;
  MPV: string;
  PLCR: string;
  PCT: string;
};

export class SysmexXP100Config extends LabConfig {
  get columns(): ProColumns<SysmexXP100Data>[] {
    return [
      THOIGIAN_COLUMNN,
      BARCODE_COLUMNN,
      Table.SELECTION_COLUMN,
      this.column('WBC'),
      this.column('RBC'),
      this.column('HGB'),
      this.column('HCT'),
      this.column('MCV'),
      this.column('MCH'),
      this.column('MCHC'),
      this.column('PLT'),
      this.column('LYMpt'),
      this.column('MXDpt'),
      this.column('NEUTpt'),
      this.column('LYM'),
      this.column('MXD'),
      this.column('NEUT'),
      this.column('RDWsd'),
      this.column('RDWcv'),
      this.column('PDW'),
      this.column('MPV'),
      this.column('PLCR'),
      this.column('PCT'),
    ];
  }

  getAll(params: any) {
    return kqSysmexXP100Service.getAll(params);
  }

  sendHis(values: any): any {}
}
