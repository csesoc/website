import { PayloadAction } from '@reduxjs/toolkit';
import {
  DeletePayloadType,
  RenamePayloadType,
  SetDirPayloadType,
} from './actions';
import { sliceState, FileEntity, Folder, File, PathObject } from './types';

/**
 * payload takes in:
 * array of type Folder || File
 */
export function setItems(
  state: sliceState,
  action: PayloadAction<FileEntity[]>
) {
  console.log(action.payload);

  const newEntityList: FileEntity[] = [...action.payload];
  return {
    ...state,
    items: newEntityList,
  };
}

export function addFolderItems(
  state: sliceState,
  action: PayloadAction<Folder>
) {
  const newFolder: Folder = action.payload;
  return {
    ...state,
    items: [...state.items, newFolder],
  };
}

export function addFileItems(state: sliceState, action: PayloadAction<File>) {
  const newFile: File = action.payload;
  return {
    ...state,
    items: [...state.items, newFile],
  };
}

export function deleteFileEntityItems(
  state: sliceState,
  action: PayloadAction<DeletePayloadType>
) {
  const { id } = action.payload;
  const stateItems = [...state.items]
    .map((item) => ({ ...item }))
    .filter((item) => item.id !== id);
  return {
    ...state,
    items: stateItems,
  };
}

export function renameFileEntity(
  state: sliceState,
  action: PayloadAction<RenamePayloadType>
) {

  const { id, newName } = action.payload;

  const items = (state.items.map((item) => {
    if (item.id == id) {
      return {
        ...item,
        name: newName,
      };
      // item.name = newName;
    }
    // else
    return item;
  }))

  console.log(items);
  
  return {
    ...state,
    items
  };
}

export function setDirectory(
  state: sliceState,
  action: PayloadAction<SetDirPayloadType>
) {
  // Helper function for setDirectory
  // checks if current folder already in breadcrumb path
  function folderInPathList(pathList: PathObject[], folderId: string): boolean {
    for (const pathObj of pathList) {
      if (pathObj.folderId === folderId) {
        return true;
      }
    }
    return false;
  }

  const pathList: PathObject[] = [...state.path];
  const destFolderName: string = action.payload.folderName;
  const destFolderId: string = action.payload.parentFolder;
  if (folderInPathList(pathList, destFolderId)) {
    while (pathList[pathList.length - 1].folderId !== destFolderId) {
      pathList.pop();
    }
  } else {
    pathList.push({ folderName: destFolderName, folderId: destFolderId });
  }

  return {
    ...state,
    parentFolder: action.payload.parentFolder,
    path: pathList,
  };
}
