import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
// local
import * as API from '../../api/index';
import * as actions from './actions';
import { Folder, File, FileEntity, sliceState } from './types';
import { getFolderState } from './selectors';

function* initSaga() {
  try {
    const root: FileEntity = yield call(API.getFolder);
    const rootId = root.id;
    const children: FileEntity[] = yield call(API.updateContents, rootId);

    // set items to be children
    yield put(actions.initItemsAction(children));
  } catch (err) {
    console.log(err);
  }
}

function* addItemSaga({ payload }: { payload: actions.AddPayloadType }) {
  switch (payload.type) {
    case 'Folder': {
      const newID: string = yield call(
        API.newFolder,
        payload.name,
        payload.parentId
      );
      // now put results to redux store
      const folderPayload: Folder = {
        id: newID,
        name: payload.name,
        parentId: payload.parentId,
        type: payload.type,
      };
      yield put(actions.addFolderItemAction(folderPayload));
      break;
    }
    case 'File': {
      const newID: string = yield call(
        API.newFile,
        payload.name,
        payload.parentId
      );
      // now put results to redux store
      const filePayload: File = {
        id: newID,
        name: payload.name,
        parentId: payload.parentId,
        type: payload.type,
      };
      yield put(actions.addFolderItemAction(filePayload));
      break;
    }
  }
}

function* deleteFileEntitySaga({
  payload,
}: {
  payload: actions.DeletePayloadType;
}) {
  yield call(API.deleteFileEntity, payload.id);
}

function* renameFileEntitySaga({
  payload,
}: // : renamePayload,
{
  payload: actions.RenamePayloadType;
}) {
  yield call(API.renameFileEntity, payload.id, payload.newName);
}

/**
 * Directory Sagas
 */
function* traverseIntoFolderSaga({ payload: id }: { payload: string }) {
  const folder: FileEntity = yield call(API.getFolder, id);
  const children: FileEntity[] = yield call(API.updateContents, id);
  const dirPayload: actions.SetDirPayloadType = {
    parentFolder: id,
    folderName: folder.name,
  };
  console.log("traversing to", folder.name)
  // change path
  yield put(actions.setDirectory(dirPayload));
  // set children
  yield put(actions.initItemsAction(children));
}

function* traverseBackFolderSaga({ payload: id }: { payload: string }) {
  const parentFolder: FileEntity = yield call(API.getFolder, id);
  const parentOfParentFolder: FileEntity = yield call(
    API.getFolder,
    parentFolder.parentId
  );
  const children: FileEntity[] = yield call(
    API.updateContents,
    parentOfParentFolder.id
  );
  const dirPayload: actions.SetDirPayloadType = {
    parentFolder: parentOfParentFolder.id,
    folderName: '',
  };

  // change path
  yield put(actions.setDirectory(dirPayload));
  // set children
  yield put(actions.initItemsAction(children));
}

// root watchers
export function* rootFoldersSaga() {
  // runs in parallel
  yield takeEvery(actions.initAction, initSaga);
  yield takeEvery(actions.addItemAction, addItemSaga);
  yield takeEvery(actions.deleteFileEntityAction, deleteFileEntitySaga);
  yield takeEvery(actions.renameFileEntityAction, renameFileEntitySaga);
  yield takeLatest(actions.traverseIntoFolder, traverseIntoFolderSaga);
  yield takeLatest(actions.traverseBackFolder, traverseBackFolderSaga);
}
