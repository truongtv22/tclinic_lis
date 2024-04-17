import { all } from 'redux-saga/effects';

import { connectionSaga } from './connection/saga';

export function* rootSaga() {
  yield all([connectionSaga()]);
}
