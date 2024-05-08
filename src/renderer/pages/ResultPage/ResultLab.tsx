import { cloneElement, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Row, Col, Space, Button } from 'antd';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  EditableProTable,
} from '@ant-design/pro-components';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import { parseString } from 'shared/utils/date';
import { LabConfig } from './LabConfig';

export function ResultLab({ labConfig }: { labConfig: LabConfig }) {
  const [form] = ProForm.useForm();

  const formValues = {
    startDate: dayjs().subtract(7, 'day').startOf('day'),
    endDate: dayjs().endOf('day'),
    status: -1,
  };

  const [dataSource, setDataSource] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    getData(formValues);
  }, [labConfig]);

  const getData = async (params: any = {}) => {
    if (params.startDate) params.startDate = parseString(params.startDate);
    if (params.endDate) params.endDate = parseString(params.endDate);
    const result = await labConfig.getAll(params);
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
          onFinish={getData}
          submitter={{
            searchConfig: {
              resetText: 'Làm mới',
              submitText: 'Tìm kiếm',
            },
            render: (_, dom) => (
              <div className="flex gap-2 justify-end">{dom}</div>
            ),
            onReset: getData,
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
        columns={labConfig.columns}
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
          getCheckboxProps: (row: any) => ({
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
          console.log('EditableProTable:onChange', v);
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
        columnEmptyText={false}
        recordCreatorProps={false}
      />
    </div>
  );
}
