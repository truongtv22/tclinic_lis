import { lazyLoad } from 'renderer/utils/loadable';

export const ViewPage = lazyLoad(
  () => import('./index'),
  (module) => module.ViewPage,
);
