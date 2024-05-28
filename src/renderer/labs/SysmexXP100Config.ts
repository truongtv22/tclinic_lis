import kqSysmexXP100Service from 'renderer/services/kqSysmexXP100';
import { LabConfig } from './LabConfig';

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
  constructor() {
    super();
    this.addField('WBC');
    this.addField('RBC');
    this.addField('HGB');
    this.addField('HCT');
    this.addField('MCV');
    this.addField('MCH');
    this.addField('MCHC');
    this.addField('PLT');
    this.addField('LYMpt');
    this.addField('MXDpt');
    this.addField('NEUTpt');
    this.addField('LYM');
    this.addField('MXD');
    this.addField('NEUT');
    this.addField('RDWsd');
    this.addField('RDWcv');
    this.addField('PDW');
    this.addField('MPV');
    this.addField('PLCR');
    this.addField('PCT');
  }

  async getAll(params: any) {
    return kqSysmexXP100Service.getAll(params);
  }

  async create(values: any) {
    return kqSysmexXP100Service.create(values);
  }

  async update(id: number, values: any) {
    return kqSysmexXP100Service.update(id, values);
  }

  async delete(id: number) {
    return kqSysmexXP100Service.delete(id);
  }

  async sendHis(connectId: number, id: number, data: any) {
    return kqSysmexXP100Service.sendHis(connectId, id, data);
  }
}
