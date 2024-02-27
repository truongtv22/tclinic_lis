import { lazyLoad } from 'utils/loadable';

export const ManagePage = lazyLoad(
  () => import('./index'),
  (module) => module.ManagePage,
);
