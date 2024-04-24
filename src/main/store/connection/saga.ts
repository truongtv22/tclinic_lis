import { all, put, select, takeLatest } from 'redux-saga/effects';
import { getConnections } from 'shared/store/connection/actions';
import { connectionSelectors } from 'shared/store/connection/slice';
import connectManage from '../../database/connectManage';
import { connectionManager } from '../../connection/manager';

function* getConnectionsSaga() {
  try {
    const data: any[] = connectManage.getAll();
    if (data && data.length > 0) {
      connectionManager.setConnections(data);
      yield put(getConnections.success(data));
    }
  } catch (error) {
    console.log('error', error);
  }
}

function* openConnectionsSaga() {
  try {
    connectionManager.openAllConnections();
  } catch (error) {
    console.log('error', error);
  }
}

export function* connectionSaga() {
  yield takeLatest(getConnections.TRIGGER, getConnectionsSaga);
  yield takeLatest(getConnections.SUCCESS, openConnectionsSaga);
}
