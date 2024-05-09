import { useDispatch } from 'react-redux';
import { Form, Input, Button, Space } from 'antd';

import { appActions } from 'renderer/store/app';

type FormData = {
  taikhoan?: string;
  matkhau?: string;
};

export function LoginPage() {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const onSubmit = (values: FormData) => {
    console.log('onSubmit', values);
    dispatch(appActions.setAuth(true));
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-96 p-6 space-y-8 rounded shadow-[0_0_100px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-slate-400 rounded-lg" />
          <h2 className="text-xl">tClinic LIS</h2>
        </div>
        <Form
          form={form}
          onFinish={onSubmit}
          initialValues={{ taikhoan: 'admin', matkhau: 'admin@123' }}
        >
          <Form.Item
            name="taikhoan"
            rules={[{ required: true, message: 'Không được để trống' }]}
            hasFeedback
          >
            <Input placeholder="Tài khoản" />
          </Form.Item>
          <Form.Item
            name="matkhau"
            rules={[{ required: true, message: 'Không được để trống' }]}
            hasFeedback
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Đăng nhập
          </Button>
        </Form>
      </div>
    </div>
  );
}
