import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

// local
import * as API from '../../api/index';
import * as actions from './actions';
import { FileEntity } from './types';


function* initSaga() {
  try {
    const root: FileEntity = yield call(API.getFolder);
    const rootId: number = root.id;
    const children:FileEntity[] = yield call(API.updateContents, rootId);
    
    // set items to be children
    yield put(actions.initItemsAction(children));
  } catch (err) {
    console.log(err);
  }
}

function* addFolderItemSaga({ payload: folder } : { payload: FileEntity }) {
  yield call(console.log, 'hi');
  yield put(actions.addFolderItemAction);
}

function* traverseIntoFolderSaga({ payload: id }: { payload: number }) {
  const children: FileEntity[] = yield call(API.updateContents, id);
  
  // change path

  // set children
  yield put(actions.initItemsAction(children))
}



// root watchers
export function* rootFoldersSaga() {
  // runs in parallel
  yield takeEvery(actions.initAction, initSaga);
  yield takeEvery(actions.addFolderItemAction, addFolderItemSaga);
  yield takeEvery(actions.traverseIntoFolder, traverseIntoFolderSaga);
}