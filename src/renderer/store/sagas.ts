import { all } from 'redux-saga/effects';

import { appSaga } from './app';
import { connectionSaga } from './connection';

export function* rootSaga() {
  yield all([appSaga(), connectionSaga()]);
}
