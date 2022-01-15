import { PayloadAction } from '@reduxjs/toolkit';
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


export function addFolderItems(state: sliceState,action: PayloadAction<Folder>){
  const newFolder: Folder = action.payload;
  return {
    ...state, 
    items: [
      ...state.items, 
      newFolder,
    ]
  }
}

export function addFileItems(state: sliceState,action: PayloadAction<File>){
  const newFile: File = action.payload;
  return {
    ...state, 
    items: [
      ...state.items, 
      newFile,
    ]
  }
}


