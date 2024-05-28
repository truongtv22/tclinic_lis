import kqBioSystemA15Service from 'renderer/services/kqBioSystemA15';
import { LabConfig } from './LabConfig';

export type BioSystemA15Data = {
  id: number;
  date_time: string;
  barcode: string;
  sendhis: number;
  CREATININE: string;
  UREA: string;
  ALT: string;
  AST: string;
  GLUCOSE: string;
  GGT: string;
  TRIGLYCERIDES: string;
  CHOLESTEROL: string;
  URIC: string;
  PROTEIN: string;
  ALB: string;
};

export class BioSystemA15Config extends LabConfig {
  constructor() {
    super();
    this.addField('CREATININE');
    this.addField('UREA');
    this.addField('ALT');
    this.addField('AST');
    this.addField('GLUCOSE');
    this.addField('GGT');
    this.addField('TRIGLYCERIDES');
    this.addField('CHOLESTEROL');
    this.addField('URIC');
    this.addField('PROTEIN');
    this.addField('ALB');
  }

  async getAll(params: any) {
    return kqBioSystemA15Service.getAll(params);
  }

  async create(values: any) {
    return kqBioSystemA15Service.create(values);
  }

  async update(id: number, values: any) {
    return kqBioSystemA15Service.update(id, values);
  }

  async delete(id: number) {
    return kqBioSystemA15Service.delete(id);
  }

  async sendHis(connectId: number, id: number, data: any) {}
}
