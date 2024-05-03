import { cloneElement, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Row, Col, Table, Space, Button } from 'antd';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  EditableProTable,
} from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import {
  EditOutlined,
  CloseOutlined,
  SaveOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import kqBW200Service from 'renderer/services/kqBW200';
import { parseString, formatDateTime } from 'shared/utils/date';

export function ResultLab() {
  const [form] = ProForm.useForm();

  const columns: ProColumns<any>[] = [
    {
      title: 'Thời gian',
      dataIndex: 'date_time',
      width: 160,
      fixed: 'left',
      renderText: formatDateTime,
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      width: 80,
      fixed: 'left',
    },
    Table.SELECTION_COLUMN,
    {
      title: 'URO',
      dataIndex: 'URO',
      width: 80,
    },
    {
      title: 'BIL',
      dataIndex: 'BIL',
      width: 80,
    },
    {
      title: 'KET',
      dataIndex: 'KET',
      width: 80,
    },
    {
      title: 'BLD',
      dataIndex: 'BLD',
      width: 80,
    },
    {
      title: 'PRO',
      dataIndex: 'PRO',
      width: 80,
    },
    {
      title: 'NIT',
      dataIndex: 'NIT',
      width: 80,
    },
    {
      title: 'LEU',
      dataIndex: 'LEU',
      width: 80,
    },
    {
      title: 'GLU',
      dataIndex: 'GLU',
      width: 80,
    },
    {
      title: 'SG',
      dataIndex: 'SG',
      width: 80,
    },
    {
      title: 'PH',
      dataIndex: 'PH',
      width: 80,
    },
    {
      title: 'VC',
      dataIndex: 'VC',
      width: 80,
    },
    {
      valueType: 'option',
      width: 65,
      fixed: 'right',
      render: (text, row, index, action, config) => (
        <>
          <Button
            size="small"
            type="link"
            icon={<EditOutlined />}
            onClick={() => action.startEditable(row.id)}
          />
          <Button
            size="small"
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => {}}
          />
        </>
      ),
    },
  ];

  const formValues = {
    startDate: dayjs().subtract(7, 'day').startOf('day'),
    endDate: dayjs().endOf('day'),
    status: -1,
  };

  const [dataSource, setDataSource] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    getKqBW200(formValues);
  }, []);

  const getKqBW200 = async (params: any = {}) => {
    if (params.startDate) {
      params.startDate = parseString(params.startDate);
    }
    if (params.endDate) {
      params.endDate = parseString(params.endDate);
    }
    const result = await kqBW200Service.getAll(params);
    if (result.success && result.data) {
      setDataSource(result.data);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Kết quả xét nghiệm</h4>
        <ProForm
          // variant="filled"
          form={form}
          initialValues={formValues}
          onFinish={async (values) => {
            getKqBW200(values);
          }}
          submitter={{
            searchConfig: {
              resetText: 'Làm mới',
              submitText: 'Tìm kiếm',
            },
            render: (props, dom) => (
              <div className="flex gap-2 justify-end">{dom}</div>
            ),
            onReset: (values) => {
              getKqBW200(values);
            },
          }}
        >
          <Row gutter={8}>
            <Col span={12}>
              <ProFormDatePicker
                name="startDate"
                label="Từ ngày"
                placeholder="Từ ngày"
                fieldProps={{
                  className: 'w-full',
                }}
              />
            </Col>
            <Col span={12}>
              <ProFormDatePicker
                name="endDate"
                label="Đến ngày"
                placeholder="Đến ngày"
                fieldProps={{
                  className: 'w-full',
                }}
              />
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <ProFormText
                name="barcode"
                label="Barcode"
                placeholder="Barcode"
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                name="status"
                label="Trạng thái"
                placeholder="Tất cả"
                options={[
                  {
                    value: -1,
                    label: 'Tất cả',
                  },
                  {
                    value: 1,
                    label: 'Đã gửi sang HIS',
                  },
                  {
                    value: 0,
                    label: 'Chưa gửi sang HIS',
                  },
                ]}
              />
            </Col>
          </Row>
        </ProForm>
      </div>
      <EditableProTable
        rowKey="id"
        value={dataSource}
        scroll={{ x: 'max-content' }}
        columns={columns}
        options={{ density: false, reload: true, setting: true }}
        toolbar={{ className: '*:p-0' }}
        tableAlertRender={({ selectedRowKeys }) => (
          <span>Đã chọn {selectedRowKeys.length} kết quả</span>
        )}
        tableAlertOptionRender={({ selectedRows, onCleanSelected }) => (
          <Space size={8}>
            <Button size="small" onClick={onCleanSelected}>
              Huỷ
            </Button>
            <Button size="small" type="primary">
              Đồng bộ HIS
            </Button>
          </Space>
        )}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          columnTitle: 'Gửi HIS',
          columnWidth: 70,
          getCheckboxProps: (row) => ({
            disabled: row.sendhis === 1,
          }),
          renderCell: (value, row, index, node) => {
            return cloneElement(
              node as any,
              row.sendhis === 1 ? { checked: true } : {},
            );
          },
        }}
        onChange={(v) => {
          console.log('v', v);
        }}
        form={
          {
            // variant: 'filled',
            // className: 'bg-red-500',
          }
        }
        // formItemProps={{
        //   rules: [{ required: true }],
        // }}
        editable={{
          type: 'single',
          actionRender: (row, config, dom) => [
            <div key="action">
              <Button
                size="small"
                type="link"
                icon={<SaveOutlined />}
                onClick={() =>
                  config.onSave(row.id, { ...row, barcode: '12' }, row)
                }
              />
              <Button
                size="small"
                type="link"
                icon={<CloseOutlined />}
                danger
                onClick={() => config.cancelEditable(row.id)}
              />
            </div>,
          ],
          //   onSave: async (rowKey, data, row) => {
          //     console.log(rowKey, data, row, 'onSave');
          //   },
          //   // editableKeys,
          //   //   onSave: async (rowKey, data, row) => {
          //   //     console.log(rowKey, data, row);
          //   //   },
          //   // onChange: setEditableRowKeys,
          onlyOneLineEditorAlertMessage: 'Chỉ cho phép chỉnh sửa từng dòng một',
        }}
        cardProps={{ bodyStyle: { padding: 0 } }}
        // components={{
        //   table: (props) => (
        //     <table
        //       {...props}
        //       onKeyDown={() => console.log('onKeyDown')}
        //     />
        //   ),
        // body: {
        //   cell: (props) => (
        //     <td
        //       {...props}
        //       tabIndex={1}
        //       className={classNames(props.className, '')}
        //     />
        //   ),
        // },
        // }}
        pagination={{ position: ['bottomRight'] }}
        recordCreatorProps={false}
      />
    </div>
  );
}
