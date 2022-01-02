import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

// local
import * as API from '../../api/index';
import * as actions from './actions';
import { File, Folder } from './types';


function* initSaga() {
  try {
    const root: Folder = yield call(API.getFolder);
    const rootId: number = root.id;
    const children:(File|Folder)[] = yield call(API.updateContents, rootId);
    
    // set items to be children
    yield put(actions.initItemsAction(children));
  } catch (err) {
    console.log(err);
  }
}


function* addFolderItemSaga({ payload: folder } : { payload: Folder}) {
  yield call(console.log, 'hi');
  yield put(actions.addFolderItemAction);
}

// root watchers
export function* rootFoldersSaga() {
  // runs in parallel
  yield takeEvery(actions.initAction, initSaga);
  yield takeEvery(actions.addFolderItemAction, addFolderItemSaga);

}