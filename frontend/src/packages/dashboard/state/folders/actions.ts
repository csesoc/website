import { createAction } from '@reduxjs/toolkit';
import { FileEntity, Folder, File } from './types';

/**
 * Payload Types
 */

export type RenamePayloadType = {
  id: string;
  newName: string;
};

export type AddPayloadType = {
  name: string;
  type: string;
  parentId: string;
};

export type DeletePayloadType = {
  id: string;
};

export type SetDirPayloadType = {
  parentFolder: string;
  folderName: string;
};

/**
 * Init Actions
 */
export const initAction = createAction('folders/init');
// this one sets all children of current folder
export const initItemsAction = createAction<FileEntity[]>('folders/initItems');

/**
 * Directory Traversal actions
 */
export const traverseIntoFolder = createAction<string>(
  'folders/traverseIntoFolder'
);
export const traverseBackFolder = createAction<string>(
  'folders/traverseBackFolder'
);
export const setDirectory = createAction<SetDirPayloadType>(
  'folders/setDirectory'
);

/**
 * CRUD actions
 */
export const addItemAction = createAction<AddPayloadType>('folders/addItem');
export const addFolderItemAction = createAction<Folder>(
  'folders/addFolderItem'
);
export const addFileItemAction = createAction<File>('folders/addFileItem');

// FileEntity = Folder | File
export const renameFileEntityAction = createAction<RenamePayloadType>(
  'folders/renameFileEntity'
);

// TODO deleteFolderItemAction
// TODO removeFileItemAction
export const deleteFileEntityAction = createAction<DeletePayloadType>(
  'folders/deleteFileEntity'
);

// TODO recursive delete function needed from backend
