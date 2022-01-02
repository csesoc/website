import { PayloadAction } from '@reduxjs/toolkit';
import { 
  sliceState,
  File,
  Folder
} from './types';

/**
 * payload takes in:
 * array of type Folder || File
 */
export function setItems(state: sliceState, action: PayloadAction<(Folder|File)[]>) {
  const newEntityList: (Folder|File)[] = action.payload;
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


