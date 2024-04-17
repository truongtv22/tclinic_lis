import { call, put, select, takeLatest } from 'redux-saga/effects';
import { connectionActions } from './slice';

function* setTest() {}

export function* connectionSaga() {
  yield takeLatest(connectionActions.setTest.type, setTest);
}
