import { Route, Routes } from 'react-router-dom';

import {
  HomePage,
  LoginPage,
  ManagePage,
  SettingPage,
  ResultPage,
  LogPage,
} from 'renderer/pages';
import { AppLayout, PageLayout } from 'renderer/layouts';
import useGlobal from 'renderer/hooks/useGlobal';

export const AppRoutes = () => {
  useGlobal();

  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route path="/view">
        <Route index element={<LogPage />} />
      </Route>
    </Routes>
  );
};
