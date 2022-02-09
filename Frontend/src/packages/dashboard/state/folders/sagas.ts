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

function* addItemSaga({ payload }: { payload: actions.AddPayloadType }) {
  switch(payload.type) {
    case "Folder": {
      const result: string = yield call(API.newFolder, payload.name);
      // now put results to redux store
      break;
    }
    // case "File": {
    //   const result = yield call(API.newFile, [payload.name]);
    //   call(console.log, result)
    //   break;
    // }
  }
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
  yield takeEvery(actions.addItemAction, addItemSaga);
  yield takeEvery(actions.renameFileEntityAction, renameFileEntitySaga);
  yield takeEvery(actions.traverseIntoFolder, traverseIntoFolderSaga);
}