import { lazyLoad } from 'renderer/utils/loadable';

export const HomePage = lazyLoad(
  () => import('./index'),
  (module) => module.HomePage,
);
