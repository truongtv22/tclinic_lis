import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { StyleProvider } from '@ant-design/cssinjs';
import { PersistGate } from 'redux-persist/es/integration/react';

import { configureAppStore } from 'store/configureStore';
import { AppRoutes } from 'routes';

import './App.css';

const { store, persistor } = configureAppStore();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StyleProvider hashPriority="high">
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </StyleProvider>
      </PersistGate>
    </Provider>
  );
}
