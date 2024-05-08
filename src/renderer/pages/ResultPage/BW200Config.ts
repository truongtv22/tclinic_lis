import { ProColumns } from '@ant-design/pro-components';
import { Table } from 'antd';

import kqBW200Service from 'renderer/services/kqBW200';
import { BARCODE_COLUMNN, LabConfig, THOIGIAN_COLUMNN } from './LabConfig';

export type BW200Data = {
  id: number;
  date_time: string;
  barcode: string;
  sendhis: number;
  URO: string;
  BIL: string;
  KET: string;
  BLD: string;
  PRO: string;
  NIT: string;
  LEU: string;
  GLU: string;
  SG: string;
  PH: string;
  VC: string;
};

export class BW200Config extends LabConfig {
  get columns(): ProColumns<BW200Data>[] {
    return [
      THOIGIAN_COLUMNN,
      BARCODE_COLUMNN,
      Table.SELECTION_COLUMN,
      this.column('URO'),
      this.column('BIL'),
      this.column('KET'),
      this.column('BLD'),
      this.column('PRO'),
      this.column('NIT'),
      this.column('LEU'),
      this.column('GLU'),
      this.column('SG'),
      this.column('PH'),
      this.column('VC'),
    ];
  }

  getAll(params: any) {
    return kqBW200Service.getAll(params);
  }

  sendHis(values: any): any {}
}
