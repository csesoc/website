import { PayloadAction } from '@reduxjs/toolkit';
import { RenamePayloadType } from './actions';
import { 
  sliceState,
  FileEntity,
  Folder,
  File
} from './types';

/**
 * payload takes in:
 * array of type Folder || File
 */
export function setItems(state: sliceState, action: PayloadAction<FileEntity[]>) {
  const newEntityList: FileEntity[] = action.payload;
  return {
    ...state,
    items: newEntityList
  }
}


export function addFolderItems(state: sliceState, action: PayloadAction<Folder>) {
  const newFolder: Folder = action.payload;
  return {
    ...state, 
    items: [
      ...state.items, 
      newFolder,
    ]
  }
}

export function addFileItems(state: sliceState, action: PayloadAction<File>) {
  const newFile: File = action.payload;
  return {
    ...state, 
    items: [
      ...state.items, 
      newFile,
    ]
  }
}

export function renameFileEntity(state: sliceState, action: PayloadAction<RenamePayloadType>) {
  const { id, newName } = action.payload;
  return {
    ...state,
    items: state.items.map((item) => {
      if(item.id == id) {
        return ({
          ...item,
          name: newName,
        })
      }
      // else
      return item;
    })
  }
}


