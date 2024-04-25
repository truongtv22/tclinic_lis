import { all } from 'redux-saga/effects';

import { connectionSaga } from '../../renderer/store/connection/saga';

export function* rootSaga() {
  yield all([connectionSaga()]);
}
