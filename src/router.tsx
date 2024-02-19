import { createHashRouter } from 'react-router-dom';
import type { Router } from '@remix-run/router';

import PageLayout from './pages/Layout/PageLayout';
import ProtectedLayout from './pages/Layout/ProtectedLayout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const router: Router = createHashRouter([
  {
    element: <PageLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
    ],
  },
]);

export default router;
