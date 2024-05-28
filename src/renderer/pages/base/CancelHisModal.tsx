import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { produce } from 'immer';
import NiceModal, { useModal, antdModalV5 } from '@ebay/nice-modal-react';
import { Button, Modal, Space } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';

import { IpcChannel } from 'shared/ipcs/types';
import { parseString, DATE_FORMAT, DATE_TIME_FORMAT } from 'shared/utils/date';
import { modal, message, useIpcListener } from 'renderer/hooks';
import { getLabConfig } from 'renderer/labs';

export const CancelHisModal = NiceModal.create(
  ({ connection }: { connection: any }) => {
    const nmodal = useModal();

    const [dataSource, setDataSource] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const labConfig = useMemo(() => {
      return getLabConfig(connection.lab);
    }, []);

    const columns: ProColumns<any>[] = useMemo(
      () => [
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
          width: 70,
          fixed: 'left',
          render(dom, row) {
            return (
              <Space>
                {row.barcode_edit}
                <span className={`${row.barcode_edit ? 'line-through' : ''}`}>
                  {row.barcode}
                </span>
              </Space>
            );
          },
          fieldProps: {
            placeholder: 'Barcode',
          },
        },
        ...labConfig.getColumns(),
      ],
      [],
    );

    useIpcListener(
      IpcChannel.HIS_CANCELED,
      async (connectId, id, result) => {
        if (connection.id === connectId && result.success) {
          setDataSource(
            produce((draft) => {
              const index = draft.findIndex((item) => item.id === id);
              if (index > -1) {
                draft.splice(index, 1);
                setSelectedKeys(
                  produce((draft) => {
                    removeById(draft, id);
                  }),
                );
              }
            }),
          );
        }
      },
      [],
    );

    const removeById = (array: any[], id: number) => {
      const index = array.indexOf(id);
      if (index > -1) array.splice(index, 1);
    };

    const onCancelHis = async (selectedItems: any[]) => {
      if (!selectedItems.length) {
        message.warning('Chọn một kết quả đồng bộ để huỷ');
        return;
      }

      const confirmed = await modal.confirm({
        title: 'Huỷ đồng bộ HIS',
        okText: 'Xác nhận',
        content: 'Xác nhận huỷ kết quả đồng bộ HIS?',
      });
      if (confirmed) {
        const results = await labConfig.bulkCancelHis(
          connection.id,
          selectedItems,
        );
        if (
          Array.isArray(results) &&
          results.every(
            (item) => item.status === 'fulfilled' && item.value.success,
          )
        ) {
          message.success('Huỷ kết quả đồng bộ HIS thành công');
        }
      }
    };

    return (
      <Modal
        {...antdModalV5(nmodal)}
        title="Huỷ kết quả đồng bộ HIS"
        width={800}
        footer={null}
      >
        <ProTable
          headerTitle="Danh sách kết quả đồng bộ"
          rowKey="id"
          params={{ lab: connection.lab, status: 1 }}
          columns={columns}
          request={async (params) => {
            const result = await labConfig.getAll(params);
            return result;
          }}
          dataSource={dataSource}
          onDataSourceChange={setDataSource}
          toolBarRender={(action, { selectedRows }) => [
            <Button
              key="button"
              size="small"
              type="primary"
              onClick={() => onCancelHis(selectedRows)}
            >
              Huỷ KQ HIS
            </Button>,
          ]}
          bordered
          scroll={{ x: 'max-content' }}
          form={{ className: 'p-0' }}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
          }}
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
