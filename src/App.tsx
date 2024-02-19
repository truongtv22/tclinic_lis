import {
  MemoryRouter as Router,
  Routes,
  RouterProvider,
} from 'react-router-dom';
import { StyleProvider } from '@ant-design/cssinjs';

import router from './router';
import './App.css';

export default function App() {
  return (
    <StyleProvider hashPriority="high">
      <RouterProvider router={router} />
      {/* <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router> */}
    </StyleProvider>
  );
}
