import { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Radio,
  Select,
  Space,
  Input,
  InputNumber,
  Typography,
  Row,
  Col,
} from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';

export function HomePage() {
  const [value, setValue] = useState(1);

  const onSubmit = (values) => {
    console.log('onSubmit', values);
  };

  return (
    <div className="flex space-x-2">
      <Card className="rounded w-72" size="small">
        <div>
          <div className="flex">
            <StarFilled className="text-yellow-400" />
            <Radio
              value={1}
              checked={value === 1}
              onChange={() => {
                setValue(1);
              }}
            >
              Cổng 1
            </Radio>
            <div>Máy xét nghiệm huyết học</div>
          </div>
          <div className="flex">
            <StarOutlined />
            <Radio
              value={2}
              checked={value === 2}
              onChange={() => {
                setValue(2);
              }}
            >
              Cổng 2
            </Radio>
            <div>Máy xét nghiệm nước tiểu</div>
          </div>
        </div>
      </Card>
      <Card className="flex-1 rounded" size="small">
        <Form colon={false} layout="vertical" onFinish={onSubmit}>
          <Typography.Title level={4}>Thông tin thiết bị</Typography.Title>
          <Form.Item name="connType" label="Kết nối" initialValue="SerialPort">
            <Select options={[{ value: 'SerialPort', label: 'SerialPort' }]} />
          </Form.Item>
          <Row gutter={8}>
            <Col sm={24} md={12}>
              <Form.Item name="path" label="ComPort" initialValue="COM1">
                <Select
                  options={[
                    { value: 'COM1', label: 'COM1' },
                    { value: 'COM2', label: 'COM2' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={12}>
              <Form.Item name="baudRate" label="BaudRate" initialValue={9600}>
                <Select
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
            <Button type="primary" size="small">
              Lưu lại
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
