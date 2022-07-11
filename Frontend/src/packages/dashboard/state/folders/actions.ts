import { createAction } from "@reduxjs/toolkit";
import { FileEntity, Folder, File } from './types';

/**
 * Payload Types
 */

export type RenamePayloadType = {
  id: number;
  newName: string;
}

export type AddPayloadType = {
  name: string;
  type: string;
  parentId: number;
}

export type SetDirPayloadType = {
  parentFolder: number;
  folderName: string;
}


/**
 * Init Actions
 */
export const initAction = createAction("folders/init");
// this one sets all children of current folder
export const initItemsAction = createAction<FileEntity[]>("folders/initItems");

/**
 * Directory Traversal actions
 */
export const traverseIntoFolder = createAction<number>("folders/traverseIntoFolder");
export const traverseBackFolder = createAction<number>("folders/traverseBackFolder");
export const setDirectory = createAction<SetDirPayloadType>("folders/setDirectory")

/**
 * CRUD actions
 */
export const addItemAction = createAction<AddPayloadType>("folders/addItem");
export const addFolderItemAction = createAction<Folder>("folders/addFolderItem");
export const addFileItemAction = createAction<File>("folders/addFileItem");


// FileEntity = Folder | File
export const renameFileEntityAction = createAction<RenamePayloadType>("folders/renameFileEntity");

// TODO removeFolderItemAction
// TODO removeFileItemAction
