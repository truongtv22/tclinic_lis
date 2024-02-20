import { MemoryRouter } from 'react-router-dom';
import { StyleProvider } from '@ant-design/cssinjs';

import { AppRoutes } from 'routes';
import './App.css';

export default function App() {
  return (
    <StyleProvider hashPriority="high">
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    </StyleProvider>
  );
}
