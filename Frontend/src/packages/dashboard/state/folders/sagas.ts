import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
// local
import * as API from '../../api/index';
import * as actions from './actions';
import {Folder, File, FileEntity, sliceState} from './types';
import { getFolderState } from "./selectors";

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

function*  addItemSaga({ payload }: { payload: actions.AddPayloadType }) {
  const folderState: sliceState = yield select(getFolderState);
  switch(payload.type) {
    case "Folder": {
      const newID: string = yield call(API.newFolder, payload.name, folderState.parentFolder);
      // now put results to redux store
      const folderPayload: Folder = {
        id: parseInt(newID),
        name: payload.name,
        parentId: folderState.parentFolder,
        type: payload.type,
      }
      yield put(actions.addFolderItemAction(folderPayload))
      break;
    }
    case "File": {
      const newID: string = yield call(API.newFile, payload.name, folderState.parentFolder);
      // now put results to redux store
      const filePayload: File = {
        id: parseInt(newID),
        name: payload.name,
        parentId: folderState.parentFolder,
        type: payload.type,
      }
      yield put(actions.addFolderItemAction(filePayload))
      break;
    }
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
  const folder: FileEntity = yield call(API.getFolder, id);
  const children: FileEntity[] = yield call(API.updateContents, id);
  const dirPayload: actions.SetDirPayloadType = {
    parentFolder: id,
    folderName: folder.name
  };
  // change path
  yield put(actions.setDirectory(dirPayload));
  // set children
  yield put(actions.initItemsAction(children));
}

function* traverseBackFolderSaga({ payload: id }: { payload: number }) {
  if (id != 0) {
    const parentFolder: FileEntity = yield call(API.getFolder, id);
    const targetFolder: FileEntity = yield call(API.getFolder, parentFolder.parentId);
    const children: FileEntity[] = yield call(API.updateContents, targetFolder.id);
    const dirPayload: actions.SetDirPayloadType = {
      parentFolder: targetFolder.id,
      folderName: ''
    };

    // change path
    yield put(actions.setDirectory(dirPayload));
    // set children
    yield put(actions.initItemsAction(children));
  }
}


// root watchers
export function* rootFoldersSaga() {
  // runs in parallel
  yield takeEvery(actions.initAction, initSaga);
  yield takeEvery(actions.addItemAction, addItemSaga);
  yield takeEvery(actions.renameFileEntityAction, renameFileEntitySaga);
  yield takeEvery(actions.traverseIntoFolder, traverseIntoFolderSaga);
  yield takeEvery(actions.traverseBackFolder, traverseBackFolderSaga);
}