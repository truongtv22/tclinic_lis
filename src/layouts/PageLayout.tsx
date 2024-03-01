import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Avatar, Layout, Dropdown, Typography, theme } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

const menus = [
  { key: '/', label: 'Hệ thống' },
  { key: '/manage', label: 'Quản lý kết nối' },
  { key: '/setting', label: 'Kết quả từ xa' },
];

export const PageLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Layout>
      <Layout.Header className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-slate-400 rounded-lg" />
        <Menu
          theme="dark"
          mode="horizontal"
          items={menus}
          selectedKeys={[pathname]}
          className="flex-1 min-w-0"
          onClick={({ key }) => navigate(key)}
        />
        <Dropdown
          menu={{
            items: [
              {
                key: 'profile',
                label: 'Hồ sơ cá nhân',
                onClick: () => navigate('/profile'),
              },
              {
                key: 'setting',
                label: 'Cài đặt',
                onClick: () => navigate('/setting'),
              },
              {
                type: 'divider',
              },
              {
                key: 'logout',
                label: 'Đăng xuất',
              },
            ],
          }}
          arrow
          trigger={['click']}
          placement="bottomRight"
        >
          <div className="cursor-pointer space-x-2">
            <Typography.Text className="text-white">Admin</Typography.Text>
            <Avatar icon={<UserOutlined />} className="bg-slate-400" />
          </div>
        </Dropdown>
      </Layout.Header>
      <Layout.Content className="pt-8 px-12">
        {/* <div
          style={{
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
        </div> */}
        <Outlet />
      </Layout.Content>
      <Layout.Footer className="text-center">
        Powered By ThinkLABs JSC
      </Layout.Footer>
    </Layout>
  );
};
