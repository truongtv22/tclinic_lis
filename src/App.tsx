import { ConfigProvider, App } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { HashRouter } from 'react-router-dom';
import { StyleProvider } from '@ant-design/cssinjs';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';

import { configureAppStore } from 'store/configureStore';
import { AppRoutes } from 'routes';

import './App.css';

const { store, persistor } = configureAppStore();

export default function AppPage() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 2,
            },
            components: {
              Modal: {
                wireframe: true,
              },
              Form: {
                itemMarginBottom: 8,
                verticalLabelPadding: '0 0 2px',
              },
            },
          }}
          locale={viVN}
        >
          <App
            message={{ maxCount: 2 }}
            notification={{
              stack: { threshold: 2 },
              placement: 'bottomRight',
            }}
          >
            <StyleProvider hashPriority="high">
              <HashRouter>
                <AppRoutes />
              </HashRouter>
            </StyleProvider>
          </App>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}
