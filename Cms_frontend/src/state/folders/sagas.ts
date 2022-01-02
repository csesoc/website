import { call, put, takeEvery } from '@redux-saga/core/effects';
import { addFolderItemAction } from './actions';
import { Folder } from './types';

function* addFolderItemSaga({ payload: folder } : { payload: Folder}) {
  yield call(console.log, 'hi');
  yield put(addFolderItemAction);

}

// root watchers
export function* rootFoldersSaga() {
  yield takeEvery(addFolderItemAction, addFolderItemSaga);

  // add more for parallelism
}