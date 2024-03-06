import { all } from 'redux-saga/effects';

import { appSaga } from './app/saga';
import { deviceSaga } from './devices/saga';

export function* rootSaga() {
  yield all([appSaga(), deviceSaga()]);
}
