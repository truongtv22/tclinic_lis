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

  const devices = useSelector(selectDevices);
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    if (selected === -1) {
      setSelected(0);
    }
  }, [selected]);

  useEffect(() => {
    if (selected > -1) {
      const data = devices[selected];
      form.setFieldsValue({
        id: data?.id || null,
        name: data?.name || '',
        connType: data?.connType || 'SerialPort',
        path: data?.path || 'COM1',
        baudRate: data?.baudRate || 9600,
        dataBits: data?.dataBits || 8,
        stopBits: data?.stopBits || 1,
        rtsMode: data?.rtsMode || 'handshake',
        parity: data?.parity || 'none',
        readTimeout: data?.readTimeout || -1,
        writeTimeout: data?.writeTimeout || -1,
      });
    }
  }, [selected, devices]);

  const onSelect = (index) => {
    setSelected(index);
  };

  const onDelete = () => {
    dispatch(deviceActions.deleteDevice(devices[selected]));
  };

  const onSubmit = (values) => {
    console.log('onSubmit', values);
    if (values.id) {
      dispatch(deviceActions.updateDevice(values));
    } else {
      dispatch(deviceActions.createDevice(values));
    }
  };

  return (
    <div className="-flex -space-x-2">
      <Split lineBar className="space-x-2">
        <Card className="min-w-60 max-w-[50%] rounded" size="small">
          <div className="space-y-2">
            {range(10).map((index) => (
              <div key={index} className="flex space-x-2">
                {devices[index] ? (
                  <StarFilled className="text-yellow-400" />
                ) : (
                  <StarOutlined />
                )}
                <Radio
                  value={1}
                  checked={selected === index}
                  onChange={() => {
                    onSelect(index);
                  }}
                >
                  <span className="line-clamp-2">
                    {devices[index]?.name || '...'}
                  </span>
                </Radio>
              </div>
            ))}
          </div>
        </Card>
        <Card className="flex-1 rounded" size="small">
          <Form form={form} layout="vertical" onFinish={onSubmit}>
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
                {devices[selected] && (
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
            <Form.Item name="name" label="Tên thiết bị" shouldUpdate>
              <Input />
            </Form.Item>
            <Form.Item
              name="connType"
              label="Kết nối"
              initialValue="SerialPort"
            >
              <Select
                options={[{ value: 'SerialPort', label: 'SerialPort' }]}
              />
            </Form.Item>
            <Row gutter={8}>
              <Col sm={24} md={12}>
                <Form.Item name="path" label="ComPort" initialValue="COM1">
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
                <Form.Item name="baudRate" label="BaudRate" initialValue={9600}>
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
                <Form.Item name="dataBits" label="DataBits" initialValue={8}>
                  <Select
                    options={[5, 6, 7, 8].map((v) => ({ value: v, label: v }))}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12}>
                <Form.Item name="stopBits" label="StopBits" initialValue={1}>
                  <Select
                    options={[1, 1.5, 2].map((v) => ({ value: v, label: v }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col sm={24} md={12}>
                <Form.Item
                  name="rtsMode"
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
                  name="readTimeout"
                  label="ReadTimeout"
                  initialValue={-1}
                >
                  <InputNumber min={-1} className="w-full" />
                </Form.Item>
              </Col>
              <Col sm={24} md={12}>
                <Form.Item
                  name="writeTimeout"
                  label="WriteTimeout"
                  initialValue={-1}
                >
                  <InputNumber min={-1} className="w-full" />
                </Form.Item>
              </Col>
            </Row>
            <Space>
              <Button type="primary" size="small">
                Mở cổng
              </Button>
              <Button size="small" disabled>
                Đóng cổng
              </Button>
            </Space>
          </Form>
        </Card>
      </Split>
    </div>
  );
}
