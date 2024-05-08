import { ProColumnType } from '@ant-design/pro-components';
import { formatDateTime } from 'shared/utils/date';

export const THOIGIAN_COLUMNN: ProColumnType<any> = {
  title: 'Thời gian',
  dataIndex: 'date_time',
  width: 169,
  fixed: 'left',
  renderText: formatDateTime,
};

export const BARCODE_COLUMNN: ProColumnType<any> = {
  title: 'Barcode',
  dataIndex: 'barcode',
  width: 80,
  fixed: 'left',
};

export class LabConfig {
  get columns(): any[] {
    return [];
  }

  get params(): any {
    return {};
  }

  column(key: string, option?: ProColumnType): ProColumnType {
    return {
      title: key,
      dataIndex: key,
      width: 80,
      ...option,
    };
  }

  async getAll(
    params: any,
  ): Promise<{ success: boolean; data?: any[]; message?: string }> {
    return { success: true, data: [] };
  }

  sendHis(values: any): any {}
}
