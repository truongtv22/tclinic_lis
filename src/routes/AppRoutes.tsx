import { Route, Routes, Navigate } from 'react-router-dom';
import { HomePage, LoginPage } from 'pages';
import { AppLayout, PageLayout } from 'layouts';

export const AppRoutes = () => {
  const isAuth = false;

  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route
          path="/"
          element={isAuth ? <HomePage /> : <Navigate to="/login" replace />}
        />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};
