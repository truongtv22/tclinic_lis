import { ProColumns } from '@ant-design/pro-components';
import { Table } from 'antd';

import kqAccess2Service from 'renderer/services/kqAccess2';
import { BARCODE_COLUMNN, LabConfig, THOIGIAN_COLUMNN } from './LabConfig';

export type Access2Data = {
  id: number;
  date_time: string;
  barcode: string;
  sendhis: number;
  PAPPA: string;
  AFP: string;
  BR153Ag: string;
  Ferritin: string;
  FRT4: string;
  HCG5: string;
  OV125Ag: string;
  PRL: string;
  PSAHyb: string;
  TotT3: string;
  TSH: string;
  uE3: string;
  HCG5d: string;
};

export class Access2Config extends LabConfig {
  get columns(): ProColumns<Access2Data>[] {
    return [
      THOIGIAN_COLUMNN,
      BARCODE_COLUMNN,
      Table.SELECTION_COLUMN,
      this.column('PAPPA'),
      this.column('AFP'),
      this.column('BR153Ag'),
      this.column('Ferritin'),
      this.column('FRT4'),
      this.column('HCG5'),
      this.column('OV125Ag'),
      this.column('PRL'),
      this.column('PSAHyb'),
      this.column('TotT3'),
      this.column('TSH'),
      this.column('uE3'),
      this.column('HCG5d'),
    ];
  }

  getAll(params: any) {
    return kqAccess2Service.getAll(params);
  }

  sendHis(values: any): any {}
}
