import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Menu, Avatar, Layout, Dropdown, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

import { appActions } from 'renderer/store/app/slice';
import { selectIsAuth } from 'renderer/store/app/selectors';

const menus = [
  { key: '/', label: 'Hệ thống' },
  { key: '/manage', label: 'Quản lý kết nối' },
  { key: '/result', label: 'Kết quả xét nghiệm' },
  { key: '/setting', label: 'Cài đặt chỉ số' },  
];

export const PageLayout = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAuth = useSelector(selectIsAuth);
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

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
                onClick: () => dispatch(appActions.setAuth(false)),
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
      <Layout.Content className="pt-8 px-12 min-h-[calc(100vh-64px-70px)]">
        <Outlet />
      </Layout.Content>
      <Layout.Footer className="text-center">
        Powered By ThinkLABs JSC
      </Layout.Footer>
    </Layout>
  );
};
