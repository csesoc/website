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

function* renameFileEntitySaga({ payload: renamePayload }: { payload: actions.RenamePayloadType }) {
  // todo call backend rename filename/foldername API call
  yield call(console.log, "saga rename fired");
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
  yield takeEvery(actions.addFolderItemAction, addFolderItemSaga);
  yield takeEvery(actions.addFileItemAction, addFileItemSaga);
  yield takeEvery(actions.renameFileEntityAction, renameFileEntitySaga);
  yield takeEvery(actions.traverseIntoFolder, traverseIntoFolderSaga);
}