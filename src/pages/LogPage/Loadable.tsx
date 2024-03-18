import { lazyLoad } from 'utils/loadable';

export const LogPage = lazyLoad(
  () => import('./index'),
  (module) => module.LogPage,
);
