import { lazyLoad } from 'renderer/utils/loadable';

export const LogPage = lazyLoad(
  () => import('./index'),
  (module) => module.LogPage,
);
