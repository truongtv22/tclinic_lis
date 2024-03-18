import { lazyLoad } from 'utils/loadable';

export const ViewPage = lazyLoad(
  () => import('./index'),
  (module) => module.ViewPage,
);
