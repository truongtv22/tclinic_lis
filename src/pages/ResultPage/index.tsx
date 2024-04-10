import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { App, Row, Col, Spin, Card, Radio, Checkbox, DatePicker } from 'antd';
import Split from '@uiw/react-split';

import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  EditableProTable,
} from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import classNames from 'classnames';

export function ResultPage() {
  const [form] = ProForm.useForm();

  const [loading, setLoading] = useState(false);

  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);

  const [dataSource, setDataSource] = useState<any>([]);
  const [editableKeys, setEditableRowKeys] = useState([]);

  const columns: ProColumns<any>[] = [
    {
      title: 'Thời gian',
      dataIndex: 'date_time',
      width: 160,
      fixed: 'left',
      renderText: (value) => {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      width: 80,
      fixed: 'left',
    },
    {
      title: 'Gửi HIS',
      dataIndex: 'sendhis',
      renderText: (value) => {
        return <Checkbox checked={value === 1} />;
      },
    },
    {
      title: 'URO',
      dataIndex: 'URO',
    },
    {
      title: 'BIL',
      dataIndex: 'BIL',
    },
    {
      title: 'KET',
      dataIndex: 'KET',
    },
    {
      title: 'BLD',
      dataIndex: 'BLD',
    },
    {
      title: 'PRO',
      dataIndex: 'PRO',
    },
    {
      title: 'NIT',
      dataIndex: 'NIT',
    },
    {
      title: 'LEU',
      dataIndex: 'LEU',
    },
    {
      title: 'GLU',
      dataIndex: 'GLU',
    },
    {
      title: 'SG',
      dataIndex: 'SG',
    },
    {
      title: 'PH',
      dataIndex: 'PH',
    },
    {
      title: 'VC',
      dataIndex: 'VC',
    },
  ];

  const formValues = {
    startDate: dayjs().subtract(1, 'day').startOf('day'),
    endDate: dayjs().endOf('day'),
    status: -1,
  };

  useEffect(() => {
    getConnect();
    getKqBW200(formValues);
  }, []);

  const getConnect = async () => {
    const result = await window.dbApi.getConnect();
    if (result.success && result.data) {
      setDevices(result.data);
      setSelected(result.data[0]);
    }
  };

  const getKqBW200 = async (params: any = {}) => {
    if (params.startDate) {
      params.startDate = dayjs(params.startDate).format('YYYY-MM-DD');
    }
    if (params.endDate) {
      params.endDate = dayjs(params.endDate).format('YYYY-MM-DD');
    }
    const result = await window.dbApi.getKqBW200(params);
    if (result.success && result.data) {
      setDataSource(result.data);
    }
  };

  const onSelect = (item: any) => {
    setSelected(item);
  };

  return (
    <Spin spinning={loading} tip="Đang tải">
      <Split lineBar className="space-x-2">
        <Card className="min-w-60 max-w-[50%]" size="small">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Danh sách thiết bị</h4>
            {devices.length > 0 ? (
              <div className="space-y-2">
                {devices.map((item) => (
                  <div key={item.id} className="flex space-x-2">
                    <Radio
                      value={1}
                      checked={item.id === selected?.id}
                      onChange={() => onSelect(item)}
                    >
                      <span className="line-clamp-2">{item.comp}</span>
                    </Radio>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Danh sách trống</p>
            )}
          </div>
        </Card>
        <Card className="flex-1 overflow-hidden" size="small">
          <div className="space-y-8">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Kết quả xét nghiệm</h4>
              <ProForm
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
              onChange={setDataSource}
              // editable={{
              //   type: 'multiple',
              //   editableKeys,
              //   onSave: async (rowKey, data, row) => {
              //     console.log(rowKey, data, row);
              //   },
              //   onChange: setEditableRowKeys,
              // }}
              cardProps={{ bodyStyle: { padding: 0 } }}
              // components={{
              //   table: (props) => (
              //     <table
              //       {...props}
              //       onKeyDown={() => console.log('onKeyDown')}
              //     />
              //   ),
              //   body: {
              //     cell: (props) => (
              //       <td
              //         {...props}
              //         tabIndex={1}
              //         className={classNames(props.className, '')}
              //       />
              //     ),
              //   },
              // }}
              pagination={{ position: ['bottomRight'] }}
              recordCreatorProps={false}
            />
          </div>
        </Card>
      </Split>
    </Spin>
  );
}
