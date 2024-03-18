import { Route, Routes } from 'react-router-dom';

import { HomePage, LoginPage, ManagePage, SettingPage, ViewPage, ResultPage } from 'pages';
import { AppLayout, PageLayout } from 'layouts';

export const AppRoutes = () => {
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
      <Route path="/view" element={<ViewPage />} />
    </Routes>
  );
};
