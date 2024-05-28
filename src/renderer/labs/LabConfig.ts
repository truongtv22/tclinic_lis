import { ProColumnType } from '@ant-design/pro-components';
import merge from 'lodash/merge';

import logSendService from 'renderer/services/logSend';
import syncHisService from 'renderer/services/syncHis';

type LabField = {
  id: string;
  title: string;
  config: any;
};

export class LabConfig {
  fields: LabField[] = [];

  addField(id: string, title?: string, config = {}) {
    this.fields.push({ id, title: title || id, config });
  }

  getColumns() {
    const columns = this.fields.map((field) => {
      const proFiled: ProColumnType<any> = {
        title: field.title,
        dataIndex: field.id,
        width: 80,
        fieldProps: {
          placeholder: field.title,
        },
        hideInSearch: true,
      };
      if (field.config) merge(proFiled, field.config);
      return proFiled;
    });
    return columns;
  }

  async getAll(
    params: any,
  ): Promise<{ success: boolean; data?: any[]; message?: string }> {
    return { success: true, data: [] };
  }

  async getLogSend(params: any) {
    return logSendService.getAll(params);
  }

  async create(values: any): Promise<any> {}

  async update(id: number, values: any): Promise<any> {}

  async delete(id: number): Promise<any> {}

  async bulkSendHis(connectId: number, values: any[]) {
    const tasks: Promise<any>[] = [];
    if (values) {
      values.forEach((data) => {
        tasks.push(syncHisService.sendHis(connectId, data.id, data));
      });
    }
    const result = await Promise.allSettled(tasks);
    return result;
  }

  async bulkCancelHis(connectId: number, values: any[]) {
    const tasks: Promise<any>[] = [];
    if (values) {
      values.forEach((data) => {
        tasks.push(syncHisService.cancelHis(connectId, data.id, data));
      });
    }
    const result = await Promise.allSettled(tasks);
    return result;
  }
}

export const labConfig = new LabConfig();
