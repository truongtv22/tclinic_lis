import { useEffect, useMemo, useState } from 'react';
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
} from 'antd';
import range from 'lodash/range';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import Split from '@uiw/react-split';

const MyInput = ({ value = '', ...props }) => {
  console.log('value', value);
  return <Input value={value} {...props} />;
};

export function HomePage() {
  const [form] = Form.useForm();

  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const data = [
      {
        id: 1,
        name: 'Máy xét nghiệm nước tiểu',
        connType: 'SerialPort',
        path: 'COM1',
        baudRate: 9600,
      },
    ];
    setDevices(data);
    form.setFieldsValue(data[0]);
  }, []);

  const onSelect = (index) => {
    const data = devices[index];
    setSelected(index);
    form.setFieldsValue({
      ...data,
      name: data?.name || '',
      connType: data?.connType || 'SerialPort',
    });
  };

  const onSubmit = (values) => {
    console.log('onSubmit', values);
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
            <Typography.Title level={4}>Thông tin thiết bị</Typography.Title>
            <Form.Item name="name" label="Tên thiết bị" shouldUpdate>
              <MyInput />
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
                  initialValue="-1"
                >
                  <InputNumber min={-1} className="w-full" />
                </Form.Item>
              </Col>
              <Col sm={24} md={12}>
                <Form.Item
                  name="writeTimeout"
                  label="WriteTimeout"
                  initialValue="-1"
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
              <Button htmlType="submit" type="primary" size="small">
                Lưu lại
              </Button>
            </Space>
          </Form>
        </Card>
      </Split>
    </div>
  );
}
