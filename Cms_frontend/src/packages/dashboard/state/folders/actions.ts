import { createAction } from "@reduxjs/toolkit";
import { Folder, File } from './types';

export const initAction = createAction("folders/init");
export const initItemsAction = createAction<(Folder|File)[]>("folders/initItems");

export const addFolderItemAction = createAction<Folder>("folders/addFolderItem");