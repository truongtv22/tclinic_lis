import { useEffect, useState } from 'react';
import { App, Spin, Card, Radio, Row, Col } from 'antd';
import Split from '@uiw/react-split';
import {
  EditableProTable,
  ProForm,
  ProFormText,
  ProFormDatePicker,
  ProFormSelect,
} from '@ant-design/pro-components';

const defaultData = [
  {
    id: 624748504,
    title: '活动名称一',
    readonly: '活动名称一',
    decs: '这个活动真好玩',
    state: 'open',
    created_at: 1590486176000,
    update_at: 1590486176000,
  },
  {
    id: 624691229,
    title: '活动名称二',
    readonly: '活动名称二',
    decs: '这个活动真好玩',
    state: 'closed',
    created_at: 1590481162000,
    update_at: 1590481162000,
  },
];

export function ResultPage() {
  const { modal, notification } = App.useApp();

  const [loading, setLoading] = useState(false);

  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);

  const [dataSource, setDataSource] = useState<any>(defaultData);
  const [editableKeys, setEditableRowKeys] = useState([]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'title',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
        };
      },
      // 第一行不允许编辑
      editable: (text, record, index) => {
        return index !== 0;
      },
      width: '15%',
    },
  ];

  const getData = async () => {
    const result = await window.dbApi.getConnect();
    if (result.success) {
      return result.data;
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      const data = await getData();
      if (data && data.length > 0) {
        setDevices(data);
        setSelected(data[0]);
      }
    })();
  }, []);

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
        <Card className="flex-1" size="small">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Kết quả xét nghiệm</h4>
            <ProForm
              submitter={{
                searchConfig: { resetText: 'Làm mới', submitText: 'Tìm kiếm' },
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
                        value: 0,
                        label: 'Tất cả',
                      },
                      {
                        value: 1,
                        label: 'Đã gửi sang HIS',
                      },
                      {
                        value: 2,
                        label: 'Chưa gửi sang HIS',
                      },
                    ]}
                  />
                </Col>
              </Row>
            </ProForm>
            <EditableProTable
              rowKey="id"
              cardProps={{ bodyStyle: { padding: 0 } }}
              columns={columns}
              value={dataSource}
              onChange={setDataSource}
              // editable={{
              //   type: 'multiple',
              //   editableKeys,
              //   onSave: async (rowKey, data, row) => {
              //     console.log(rowKey, data, row);
              //   },
              //   onChange: setEditableRowKeys,
              // }}
            />
          </div>
        </Card>
      </Split>
    </Spin>
  );
}
