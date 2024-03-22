import { useEffect, useMemo, useState } from 'react';
import { produce } from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Spin,
  Card,
  Form,
  Radio,
  Input,
  Space,
  Select,
  Button,
  Popconfirm,
  InputNumber,
  AutoComplete,
  notification,
} from 'antd';
import range from 'lodash/range';
import {
  StarOutlined,
  StarFilled,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Split from '@uiw/react-split';
import { selectDevices } from 'store/devices/selectors';
import { deviceActions } from 'store/devices/slice';

export function HomePage() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // const devices = useSelector(selectDevices);
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);

  const [notificationApi, contextHolder] = notification.useNotification({
    stack: true,
  });

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

  useEffect(() => {
    if (selected) {
      form.setFieldsValue(selected);
    } else {
      form.resetFields();
    }
  }, [selected]);

  useEffect(() => {
    const openSub = window.electron.serialport.on('open', () => {
      setConnected(true);
    });

    const errorSub = window.electron.serialport.on('error', (error: any) => {
      notificationApi.error({
        message: 'SerialPort',
        description: error.message,
      });
    });

    const dataSub = window.electron.serialport.on('data', (data) => {
      console.log('HomePage->data', data);
    });

    const closeSub = window.electron.serialport.on('close', () => {
      setConnected(false);
    });

    return () => {
      openSub();
      errorSub();
      dataSub();
      closeSub();
    };
  }, []);

  const onAdd = () => {
    setSelected(null);
  };

  const onSelect = (item: any) => {
    setSelected(item);
  };

  const onSave = async (values: any) => {
    console.log('onSubmit', values);
    setLoading(true);
    if (values.id) {
      const result = await window.dbApi.updateConnect(values);
      console.log('result', result);
      if (result.success) {
        const newDevices = produce(devices, (draft) => {
          const index = draft.findIndex((item) => item.id === values.id);
          if (index > -1) {
            draft.splice(index, 1, result.data);
          }
        });
        setDevices(newDevices);
        notificationApi.success({
          message: 'Thành công',
          description: 'Cập nhật kết nối thành công',
        });
      }
      // dispatch(deviceActions.updateDevice(values));
    } else {
      const result = await window.dbApi.createConnect(values);
      console.log('result', result);
      if (result.success) {
        const newDevices = produce(devices, (draft) => {
          draft.push(result.data);
        });
        setDevices(newDevices);
        setSelected(result.data);
        notificationApi.success({
          message: 'Thành công',
          description: 'Thêm mới kết nối thành công',
        });
      }
      // dispatch(deviceActions.createDevice(values));
    }
    setLoading(false);
  };

  const onDelete = async (id: any) => {
    setLoading(true);
    const result = await window.dbApi.deleteConnect(id);
    console.log('result', result);
    if (result.success) {
      const newDevices = produce(devices, (draft) => {
        const index = draft.findIndex((item) => item.id === id);
        if (index > -1) {
          draft.splice(index, 1);
        }
      });
      setDevices(newDevices);
      if (newDevices.length > 0) {
        setSelected(newDevices[0]);
      } else {
        setSelected(null);
      }
      notificationApi.success({
        message: 'Thành công',
        description: 'Xoá kết nối thành công',
      });
    }
    // dispatch(deviceActions.deleteDevice(devices[selected]));
    setLoading(false);
  };

  const onOpen = () => {
    const params = form.getFieldsValue();
    window.electron.serialport.connect(params);
  };

  const onClose = () => {
    const params = form.getFieldsValue();
    window.electron.serialport.disconnect({ id: params.id });
  };

  const onViewLog = () => {
    window.electron.ipcRenderer.send('open-view-window');
  };

  return (
    <Spin spinning={loading} tip="Đang tải">
      {contextHolder}
      <Split lineBar className="space-x-2">
        <Card className="min-w-60 max-w-[50%] rounded" size="small">
          <div className="space-y-2">
            <p className="text-xl font-semibold">Danh sách kết nối</p>
            {devices.length > 0 ? (
              <div className="space-y-2">
                {devices.map((item) => (
                  <div key={item.id} className="flex space-x-2">
                    {/* devices[index] ? (
                  <StarFilled className="text-yellow-400" />
                ) : (
                  <StarOutlined />
                ) */}
                    <Radio
                      value={1}
                      checked={item.id === selected?.id}
                      onChange={() => {
                        onSelect(item);
                      }}
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
        <Card className="flex-1 rounded" size="small">
          <Form form={form} layout="vertical" onFinish={onSave}>
            <Row
              gutter={8}
              align="middle"
              justify="space-between"
              className="mb-2"
            >
              <Col>
                <p className="text-xl font-semibold">
                  {selected
                    ? 'Thông tin kết nối'
                    : 'Thêm mới thông tin kết nối'}
                </p>
              </Col>
              <Row gutter={4}>
                <Col>
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    disabled={!selected}
                    onClick={onAdd}
                  >
                    Thêm
                  </Button>
                </Col>
                <Col>
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="small"
                    icon={<SaveOutlined />}
                  >
                    Lưu lại
                  </Button>
                </Col>
                <Col>
                  <Popconfirm
                    title="Xoá kết nối"
                    description="Bạn muốn xóa kết nối này không?"
                    okText="Xoá"
                    cancelText="Không"
                    onConfirm={() => onDelete(selected.id)}
                  >
                    <Button
                      size="small"
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      disabled={!selected}
                    >
                      Xoá
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>
            </Row>
            <Form.Item name="id" hidden />
            <Form.Item name="comp" label="Tên thiết bị">
              <Input />
            </Form.Item>
            <Form.Item
              name="kieuketnoi"
              label="Kết nối"
              initialValue="SerialPort"
            >
              <Select
                options={['SerialPort', 'Foder'].map((v) => ({
                  value: v,
                  label: v,
                }))}
              />
            </Form.Item>
            <Row gutter={8}>
              <Col sm={24} md={12}>
                <Form.Item name="comport" label="ComPort" initialValue="COM1">
                  <AutoComplete
                    options={[
                      'COM1',
                      'COM2',
                      'COM3',
                      'COM4',
                      'COM5',
                      'COM6',
                      'COM7',
                      'COM8',
                      'COM9',
                      'COM10',
                    ].map((v) => ({
                      value: v,
                      label: v,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12}>
                <Form.Item name="baudrate" label="BaudRate" initialValue={9600}>
                  <AutoComplete
                    options={[
                      110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400,
                      57600, 115200,
                    ].map((v) => ({ value: v, label: v }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col sm={24} md={12}>
                <Form.Item name="databits" label="DataBits" initialValue={8}>
                  <Select
                    options={[5, 6, 7, 8].map((v) => ({ value: v, label: v }))}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12}>
                <Form.Item name="stopbits" label="StopBits" initialValue={1}>
                  <Select
                    options={[1, 1.5, 2].map((v) => ({ value: v, label: v }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col sm={24} md={12}>
                <Form.Item
                  name="rtsmode"
                  label="RtsMode"
                  initialValue="handshake"
                >
                  <Select
                    options={['handshake', 'enable', 'toggle'].map((v) => ({
                      value: v,
                      label: v,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12}>
                <Form.Item name="parity" label="Parity" initialValue="none">
                  <Select
                    options={['none', 'even', 'odd', 'mark', 'space'].map(
                      (v) => ({
                        value: v,
                        label: v,
                      }),
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col sm={24} md={12}>
                <Form.Item
                  name="readtimeout"
                  label="ReadTimeout"
                  initialValue={-1}
                >
                  <InputNumber min={-1} className="w-full" />
                </Form.Item>
              </Col>
              <Col sm={24} md={12}>
                <Form.Item
                  name="writetimeout"
                  label="WriteTimeout"
                  initialValue={-1}
                >
                  <InputNumber min={-1} className="w-full" />
                </Form.Item>
              </Col>
            </Row>
            <Space>
              <Button
                type="primary"
                size="small"
                disabled={connected}
                onClick={onOpen}
              >
                Mở cổng
              </Button>
              <Button
                type="primary"
                size="small"
                disabled={!connected}
                onClick={onClose}
              >
                Đóng cổng
              </Button>
              <Button size="small" onClick={onViewLog}>
                Xem nhật ký
              </Button>
            </Space>
          </Form>
        </Card>
      </Split>
    </Spin>
  );
}
