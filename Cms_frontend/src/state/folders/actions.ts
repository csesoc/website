import { createAction } from "@reduxjs/toolkit";
import { Folder } from './types';

export const addFolderItemAction = createAction<Folder>("folders/addFolderItem");