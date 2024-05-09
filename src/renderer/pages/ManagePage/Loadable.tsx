import { lazyLoad } from 'renderer/utils/loadable';

export const ManagePage = lazyLoad(
  () => import('./index'),
  (module) => module.ManagePage,
);
