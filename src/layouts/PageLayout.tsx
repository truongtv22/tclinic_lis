import { Outlet } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';

const menus = [
  { key: 1, label: 'Hệ thống' },
  { key: 2, label: 'Quản lý kết nối' },
];

export const PageLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Layout.Header className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-slate-400 rounded-lg" />
        <Menu
          theme="dark"
          mode="horizontal"
          items={menus}
          className="flex-1 min-w-0"
        />
      </Layout.Header>
      <Layout.Content className="pt-8 px-12">
        <div
          style={{
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Layout.Content>
      <Layout.Footer className="text-center">
        Powered By ThinkLABs JSC
      </Layout.Footer>
    </Layout>
  );
};
