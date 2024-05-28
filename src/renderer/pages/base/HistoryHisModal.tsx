import { useMemo } from 'react';
import dayjs from 'dayjs';
import NiceModal, { useModal, antdModalV5 } from '@ebay/nice-modal-react';
import { Modal } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';

import { parseString, DATE_FORMAT, DATE_TIME_FORMAT } from 'shared/utils/date';
import { getLabConfig } from 'renderer/labs';

type LogSendItem = {
  id: number;
  lab: string;
  date_time: string;
  barcode: number;
  barcode_edit: string;
  ds_ketqua: string;
  message: string;
};

export const HistoryHisModal = NiceModal.create(
  ({ connection }: { connection: any }) => {
    const modal = useModal();

    const columns: ProColumns<LogSendItem>[] = [
      {
        title: 'Thời gian',
        dataIndex: 'date_time',
        width: 140,
        fixed: 'left',
        valueType: 'dateTime',
        fieldProps: {
          format: DATE_TIME_FORMAT,
        },
        hideInSearch: true,
      },
      {
        title: 'Từ ngày',
        dataIndex: 'startDate',
        valueType: 'date',
        hideInTable: true,
        search: {
          transform: (v) => parseString(v, DATE_FORMAT),
        },
        fieldProps: {
          format: DATE_FORMAT,
          placeholder: 'Từ ngày',
        },
        initialValue: dayjs().subtract(7, 'day').startOf('day'),
      },
      {
        title: 'Đến ngày',
        dataIndex: 'endDate',
        valueType: 'date',
        hideInTable: true,
        search: {
          transform: (v) => parseString(v, DATE_FORMAT),
        },
        fieldProps: {
          format: DATE_FORMAT,
          placeholder: 'Đến ngày',
        },
        initialValue: dayjs().endOf('day'),
      },
      {
        title: 'Barcode',
        dataIndex: 'barcode',
        width: 90,
        fixed: 'left',
        fieldProps: {
          placeholder: 'Barcode',
        },
      },
      {
        title: 'Barcode mới',
        dataIndex: 'barcode_edit',
        hideInSearch: true,
      },
      {
        title: 'Danh sách kết quả',
        dataIndex: 'ds_ketqua',
        hideInSearch: true,
      },
      {
        title: 'Kết quả trả lại',
        dataIndex: 'message',
        hideInSearch: true,
      },
    ];

    const labConfig = useMemo(() => {
      return getLabConfig(connection.lab);
    }, []);

    return (
      <Modal
        {...antdModalV5(modal)}
        title="Lịch sử đồng bộ kết quả HIS"
        width={800}
        footer={null}
      >
        <ProTable<LogSendItem>
          headerTitle="Danh sách kết quả đồng bộ"
          rowKey="id"
          params={{ lab: connection.lab }}
          columns={columns}
          request={async (params) => {
            const result = await labConfig.getLogSend(params);
            return result;
          }}
          bordered
          scroll={{ x: 'max-content' }}
          form={{ className: 'p-0' }}
          search={{
            // className: 'mbe-0',
            resetText: 'Làm mới',
            labelWidth: 'auto',
            collapsed: false,
            collapseRender: false,
            searchGutter: [16, 8],
          }}
          toolbar={{ className: '*:py-1' }}
          cardProps={{ bodyStyle: { padding: 0 } }}
          options={{
            density: false,
          }}
          columnEmptyText={false}
        />
      </Modal>
    );
  },
);
