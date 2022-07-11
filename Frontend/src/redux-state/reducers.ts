import { combineReducers } from "@reduxjs/toolkit";
import { reducer as foldersReducer} from 'src/packages/dashboard/state/folders/index';
import { reducer as editorReducer } from 'src/packages/editor/state/index';

export const rootReducer = combineReducers({
  folders: foldersReducer,
  editor: editorReducer
});

export type RootState = ReturnType<typeof rootReducer>