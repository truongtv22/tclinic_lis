import { Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

export function LoginPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-96 p-6 shadow-lg rounded">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-400 rounded-lg" />
          <h2 className="text-xl">tClinic LIS</h2>
        </div>
        <div>
          <Form>
            <Form.Item name="taikhoan">
              <Input placeholder="Tài khoản" />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
