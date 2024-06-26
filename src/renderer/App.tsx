import { useContext } from 'react';
import { ConfigProvider, App, theme } from 'antd';
import merge from 'lodash/merge';
import { ProProvider, createIntl } from '@ant-design/pro-components';
import viVN from 'antd/locale/vi_VN';
import viVNLocale from '@ant-design/pro-provider/lib/locale/vi_VN';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/vi';
import { HashRouter } from 'react-router-dom';
import { StyleProvider } from '@ant-design/cssinjs';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';
import NiceModal from '@ebay/nice-modal-react';

import { configureAppStore } from 'renderer/store/configureStore';
import { AppRoutes } from 'renderer/routes';

import './App.css';

dayjs.extend(updateLocale);
dayjs.updateLocale('vi', {
  monthsShort:
    'Thg 1_Thg 2_Thg 3_Thg 4_Thg 5_Thg 6_Thg 7_Thg 8_Thg 9_Thg 10_Thg 11_Thg 12'.split(
      '_',
    ),
});

const { store, persistor } = configureAppStore();
const viVNIntl = createIntl(
  'vi_VN',
  merge(viVNLocale, {
    alert: {
      selected: 'Đã chọn',
      item: 'kết quả',
    },
    pagination: {
      total: {
        range: ' ',
        total: 'tổng',
        item: ' ',
      },
    },
    editableTable: {
      onlyAddOneLine: 'Chỉ có thể thêm một dòng mới',
      onlyOneLineEditor: 'Chỉ cho phép chỉnh sửa từng dòng một',
      action: {
        save: 'Lưu',
      },
    },
  }),
);

export default function AppPage() {
  const proConfig = useContext(ProProvider);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            algorithm: theme.compactAlgorithm,
            token: {
              borderRadius: 2,
            },
            components: {
              Modal: {
                wireframe: true,
              },
              Form: {
                itemMarginBottom: 0,
                verticalLabelPadding: '0 0 2px',
              },
            },
          }}
          locale={viVN}
        >
          <ProProvider.Provider value={{ ...proConfig, intl: viVNIntl }}>
            <App
              message={{ maxCount: 2 }}
              notification={{
                stack: { threshold: 2 },
                placement: 'bottomRight',
              }}
            >
              <StyleProvider hashPriority="high">
                <NiceModal.Provider>
                  <HashRouter>
                    <AppRoutes />
                  </HashRouter>
                </NiceModal.Provider>
              </StyleProvider>
            </App>
          </ProProvider.Provider>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}
