import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

// local
import * as API from '../../api/index';
import * as actions from './actions';
import { Folder, File, FileEntity } from './types';


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

function* addFolderItemSaga({ payload: folder } : { payload: Folder }) {
  // todo call backend API
  yield call(console.log, folder);
}


function* addFileItemSaga({ payload: file }: { payload: File }) {
  // todo call backend API
  yield call(console.log, file);
}

/**
 * Directory Sagas
 */
function* traverseIntoFolderSaga({ payload: id }: { payload: number }) {
  const children: FileEntity[] = yield call(API.updateContents, id);
  // todo change path
  // set children
  yield put(actions.initItemsAction(children))
}



// root watchers
export function* rootFoldersSaga() {
  // runs in parallel
  yield takeEvery(actions.initAction, initSaga);
  yield takeLatest(actions.addFolderItemAction, addFolderItemSaga);
  yield takeLatest(actions.addFileItemAction, addFileItemSaga);
  yield takeEvery(actions.traverseIntoFolder, traverseIntoFolderSaga);
}