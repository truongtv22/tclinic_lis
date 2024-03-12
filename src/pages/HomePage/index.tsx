import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Button,
  Card,
  Form,
  Radio,
  Select,
  Space,
  Input,
  InputNumber,
  Typography,
  AutoComplete,
  Popconfirm,
} from 'antd';
import range from 'lodash/range';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import Split from '@uiw/react-split';
import { selectDevices } from 'store/devices/selectors';
import { deviceActions } from 'store/devices/slice';

export function HomePage() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // const devices = useSelector(selectDevices);
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);

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
        setSelected(data[0].id);
      }
    })();
  }, []);

  // useEffect(() => {
  //   if (selected === -1) {
  //     setSelected(0);
  //   }
  // }, [selected]);

  // useEffect(() => {
  //   if (selected > -1) {
  //     const data = devices[selected];
  //     form.setFieldsValue({
  //       id: data?.id || null,
  //       lab: data?.lab || '',
  //       kieuketnoi: data?.kieuketnoi || 'SerialPort',
  //       comport: data?.comport || 'COM1',
  //       baudrate: data?.baudrate || 9600,
  //       databits: data?.databits || 8,
  //       stopbits: data?.stopbits || 1,
  //       rtsmode: data?.rtsmode || 'handshake',
  //       parity: data?.parity || 'none',
  //       readtimeout: data?.readtimeout || -1,
  //       writetimeout: data?.writetimeout || -1,
  //     });
  //   }
  // }, [selected, devices]);

  const onSelect = (item: any) => {
    setSelected(item);
  };

  const onSave = async (values: any) => {
    console.log('onSubmit', values);
    if (values.id) {
      //   dispatch(deviceActions.updateDevice(values));
    } else {
      const result = await window.dbApi.createConnect(values);
      console.log('result', result);
      //   dispatch(deviceActions.createDevice(values));
    }
  };

  const onDelete = () => {
    // dispatch(deviceActions.deleteDevice(devices[selected]));
  };

  const onOpen = () => {
    // const device = devices[selected];
    // window.electron.serialport.connect(device);
  };

  const onClose = () => {
    // window.electron.serialport.disconnect();
  };

  return (
    <div className="-flex -space-x-2">
      <Split lineBar className="space-x-2">
        <Card className="min-w-60 max-w-[50%] rounded" size="small">
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
                  <span className="line-clamp-2">{item.name}</span>
                </Radio>
              </div>
            ))}
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
                <p className="text-2xl font-semibold">Thông tin thiết bị</p>
              </Col>
              <Row gutter={4}>
                {selected?.id && (
                  <Col>
                    <Popconfirm
                      title="Xoá thiết bị"
                      description="Bạn muốn xóa thiết bị này không?"
                      okText="Xoá"
                      cancelText="Không"
                      onConfirm={onDelete}
                    >
                      <Button size="small" danger>
                        Xoá
                      </Button>
                    </Popconfirm>
                  </Col>
                )}
                <Col>
                  <Button htmlType="submit" type="primary" size="small">
                    Lưu lại
                  </Button>
                </Col>
              </Row>
            </Row>
            <Form.Item name="id" hidden />
            <Form.Item name="lab" label="Tên thiết bị" shouldUpdate>
              <Input />
            </Form.Item>
            <Form.Item
              name="kieuketnoi"
              label="Kết nối"
              initialValue="SerialPort"
            >
              <Select
                options={[{ value: 'SerialPort', label: 'SerialPort' }]}
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
              <Button type="primary" size="small" onClick={onOpen}>
                Mở cổng
              </Button>
              <Button size="small" onClick={onClose}>
                Đóng cổng
              </Button>
            </Space>
          </Form>
        </Card>
      </Split>
    </div>
  );
}
