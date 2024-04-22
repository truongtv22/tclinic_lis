import React, { useEffect, useState, useRef, useCallback } from "react";
import { Button, Col, Form, Input, Row, Typography, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";

export function SettingPage() {
  const [formSetting] = Form.useForm();
  const [data, setData] = useState([]);

  const onSave = async (values) => {
    console.log(window.electron, "window.electron")
    const resp = await window.electron.ipcRenderer.invoke("add-category", {
      name: "Thinklabs",
      remark: "remark",
      sort: 1
    });
    if (resp.code === 200) {
      message.success("新增成功");      
    } else {
      message.error(resp.msg);
    }
  };

  const fetchData = useCallback(() => {
    const dataRes = window.sqlite.personDB?.readAllPerson();
    setData(dataRes);
  }, []);
  console.log("data", data);

  return (
    <Form size="small" layout="vertical" onFinish={onSave} name="setting" form={formSetting}>
      <Typography.Title level={5}>1. Cài đặt chỉ số</Typography.Title>
      <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
        Lưu dữ liệu
      </Button>
      <Row gutter={10}>
        <Form.Item name="_id" label="_id" hidden>
          <Input />
        </Form.Item>
        <Col xs={12}>
          <Form.Item name="tenphongkham" label={<span className="font-medium">Phòng khám</span>} hasFeedback rules={[{ required: false, whitespace: true, message: "Không được để trống" }]}>
            <Input placeholder="Phòng khám" value={"10"} />
          </Form.Item>
        </Col>
        <Col xs={6}>
          <Form.Item name="email" label={<span className="font-medium">Email</span>} hasFeedback rules={[{ required: false, whitespace: true, message: "Không được để trống" }]}>
            <Input placeholder="Email" value={10} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
