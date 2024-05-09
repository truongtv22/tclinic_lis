import { lazyLoad } from 'renderer/utils/loadable';

export const ResultPage = lazyLoad(
  () => import('./index'),
  (module) => module.ResultPage,
);
