import kqAccess2Service from 'renderer/services/kqAccess2';
import { LabConfig } from './LabConfig';

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
  constructor() {
    super();
    this.addField('PAPPA');
    this.addField('AFP');
    this.addField('BR153Ag');
    this.addField('Ferritin');
    this.addField('FRT4');
    this.addField('HCG5');
    this.addField('OV125Ag');
    this.addField('PRL');
    this.addField('PSAHyb');
    this.addField('TotT3');
    this.addField('TSH');
    this.addField('uE3');
    this.addField('HCG5d');
  }

  async getAll(params: any) {
    return kqAccess2Service.getAll(params);
  }

  async create(values: any) {
    return kqAccess2Service.create(values);
  }

  async update(id: number, values: any) {
    return kqAccess2Service.update(id, values);
  }

  async delete(id: number) {
    return kqAccess2Service.delete(id);
  }
}
