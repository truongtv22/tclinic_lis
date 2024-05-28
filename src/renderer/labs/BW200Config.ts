import kqBW200Service from 'renderer/services/kqBW200';
import { LabConfig } from './LabConfig';

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
  constructor() {
    super();
    this.addField('URO');
    this.addField('BIL');
    this.addField('KET');
    this.addField('BLD');
    this.addField('PRO');
    this.addField('NIT');
    this.addField('LEU');
    this.addField('GLU');
    this.addField('SG');
    this.addField('PH');
    this.addField('VC');
  }

  async getAll(params: any) {
    return kqBW200Service.getAll(params);
  }

  async create(values: any) {
    return kqBW200Service.create(values);
  }

  async update(id: number, values: any) {
    return kqBW200Service.update(id, values);
  }

  async delete(id: number) {
    return kqBW200Service.delete(id);
  }

  async sendHis(connectId: number, id: number, data: any) {
    return kqBW200Service.sendHis(connectId, id, data);
  }

  async cancelHis(connectId: number, id: number, data: any) {
    return kqBW200Service.sendHis(connectId, id, data);
  }
}
