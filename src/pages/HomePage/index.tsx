import { useState } from 'react';
import { Card, Form, Radio, Select } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';

export function HomePage() {
  const [value, setValue] = useState(1);

  const onSubmit = (values) => {
    console.log('onSubmit', values);
  };

  return (
    <div className="flex space-x-2">
      <Card className="rounded w-72">
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
      <Card className="flex-1 rounded">
        <Form colon={false} onFinish={onSubmit}>
          <Form.Item name="connType" label="Kết nối">
            <Select
              options={[{ value: 'SerialPort', label: 'SerialPort' }]}
              placeholder="Lựa chọn"
            />
          </Form.Item>
          <Form.Item name="path" label="ComPort">
            <Select
              options={[
                { value: 'COM1', label: 'COM1' },
                { value: 'COM2', label: 'COM2' },
              ]}
              placeholder="Lựa chọn"
            />
          </Form.Item>
          <Form.Item name="baudRate" label="BaudRate">
            <Select
              options={[
                110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600,
                115200,
              ].map((v) => ({ value: v, label: v }))}
              placeholder="Lựa chọn"
            />
          </Form.Item>
          <Form.Item name="dataBits" label="DataBits">
            <Select
              options={[5, 6, 7, 8].map((v) => ({ value: v, label: v }))}
              placeholder="Lựa chọn"
            />
          </Form.Item>
        </Form>
        <div>Kết nối SerialPort</div>
        <div>ComPort path COM1</div>
        <div>BaudRate baudRate 9600</div>
        <div>DataBits dataBits 8</div>
        <div>StopBits stopBits 1</div>
        <div>RtsMode rtsMode handshake</div>
        <div>Parity parity none</div>
        <div>ReadTimeout readTimeout -1</div>
        <div>WriteTimeout writeTimeout -1</div>
        <div>Mở cổng</div>
        <div>Đóng cổng</div>
        <div>Lưu lại</div>
      </Card>
    </div>
  );
}
