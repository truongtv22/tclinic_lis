import { lazyLoad } from 'renderer/utils/loadable';

export const SettingPage = lazyLoad(
  () => import('./index'),
  (module) => module.SettingPage,
);
