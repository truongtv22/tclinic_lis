import { all, put, select, takeLatest } from 'redux-saga/effects';
import { getConnections } from 'shared/store/connection/actions';
import { connectionSelectors } from 'shared/store/connection/slice';
import connectManage from '../../database/connectManage';

function* getConnectionsSaga() {
  try {
    const data = connectManage.getAll();
    yield put(getConnections.success(data));
  } catch (error) {
    console.log('error', error);
  }
}

function* openConnectionsSaga(): any {
  try {
    const data = yield select(connectionSelectors.selectConnections);
    if (data && data.length > 0) {
      data.forEach((item: any) => {

      });
    }
  } catch (error) {
    console.log('error', error);
  }
}

export function* connectionSaga() {
  yield takeLatest(getConnections.TRIGGER, getConnectionsSaga);
  yield takeLatest(getConnections.SUCCESS, openConnectionsSaga);
}
