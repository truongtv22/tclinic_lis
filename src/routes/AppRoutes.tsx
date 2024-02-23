import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import { HomePage, LoginPage } from 'pages';
import { AppLayout, PageLayout } from 'layouts';
import { selectIsAuth } from 'store/app/selectors';

export const AppRoutes = () => {
  const isAuth = useSelector(selectIsAuth);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate('/', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [isAuth]);

  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};
