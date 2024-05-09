import { lazyLoad } from 'renderer/utils/loadable';

export const LoginPage = lazyLoad(
  () => import('./index'),
  (module) => module.LoginPage,
);
