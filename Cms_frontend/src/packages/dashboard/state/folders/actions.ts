import { createAction } from "@reduxjs/toolkit";
import { FileEntity, Folder, sliceState } from './types';

export const initAction = createAction("folders/init");
export const initItemsAction = createAction<FileEntity[]>("folders/initItems");

/**
 * Directory Traversal
 */
export const traverseIntoFolder = createAction<number>("folders/traverseIntoFolder");
// TODO
export const setDirectory = createAction<sliceState>("folders/setDirectory")
/**
 * CRUD
 */
export const addFolderItemAction = createAction<Folder>("folders/addFolderItem");
// TODO removeFolderItemAction
