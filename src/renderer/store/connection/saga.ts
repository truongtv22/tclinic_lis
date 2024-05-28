import { put, takeLatest } from 'redux-saga/effects';
import connectionService from 'renderer/services/connection';
import { message } from 'renderer/hooks';
import {
  getConnections,
  getStatusConnections,
  createConnection,
  updateConnection,
  deleteConnection,
} from './actions';

function* onGetConnections(): any {
  const result = yield connectionService.getAll();
  if (result.success) {
    yield put(getConnections.success(result.data));
  } else {
    yield put(getConnections.failure(result.message));
  }
}

function* onGetStatusConnections(): any {
  const result = yield connectionService.getAllStatus();
  if (result.success) {
    yield put(getStatusConnections.success(result.data));
  } else {
    yield put(getStatusConnections.failure(result.message));
  }
}

function* onCreateConnection(action: any): any {
  const [values] = action.payload;
  const result = yield connectionService.create(values);
  if (result.success) {
    message.success('Thêm mới kết nối thành công');
    yield put(createConnection.success(result.data));
  } else {
    yield put(createConnection.failure(result.message));
  }
}

function* onUpdateConnection(action: any): any {
  const [id, values] = action.payload;
  const result = yield connectionService.update(id, values);
  if (result.success) {
    message.success('Cập nhật kết nối thành công');
    yield put(updateConnection.success([id, result.data]));
  } else {
    yield put(updateConnection.failure(result.error));
  }
}

function* onDeleteConnection(action: any): any {
  const [id] = action.payload;
  const result = yield connectionService.delete(id);
  if (result.success) {
    message.success('Xoá kết nối thành công');
    yield put(deleteConnection.success([id]));
  } else {
    yield put(deleteConnection.failure(result.message));
  }
}

export function* connectionSaga() {
  yield takeLatest(getConnections.TRIGGER, onGetConnections);
  yield takeLatest(getConnections.SUCCESS, onGetStatusConnections);
  yield takeLatest(createConnection.TRIGGER, onCreateConnection);
  yield takeLatest(updateConnection.TRIGGER, onUpdateConnection);
  yield takeLatest(deleteConnection.TRIGGER, onDeleteConnection);
}
