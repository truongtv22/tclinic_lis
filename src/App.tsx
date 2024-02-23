import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { StyleProvider } from '@ant-design/cssinjs';

import { configureAppStore } from 'store/configureStore';
import { AppRoutes } from 'routes';

import './App.css';

const store = configureAppStore();

export default function App() {
  return (
    <Provider store={store}>
      <StyleProvider hashPriority="high">
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </StyleProvider>
    </Provider>
  );
}
