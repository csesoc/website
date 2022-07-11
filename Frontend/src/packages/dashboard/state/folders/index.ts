import { createReducer } from "@reduxjs/toolkit";
import { initialState } from "./initial-state";
import * as reducerFns from './reducers';
import * as folderSelectors from './selectors';
import * as foldersActions from './actions';
import * as foldersSagas from './sagas';

const reducer = createReducer(initialState, (builder) => {
  // addCase(action, reducer);
  builder.addCase(foldersActions.addFolderItemAction, reducerFns.addFolderItems);
  builder.addCase(foldersActions.addFileItemAction, reducerFns.addFileItems);
  builder.addCase(foldersActions.renameFileEntityAction, reducerFns.renameFileEntity);
  // init reducers
  builder.addCase(foldersActions.initItemsAction, reducerFns.setItems);
  builder.addCase(foldersActions.setDirectory, reducerFns.setDirectory);
})

export { 
  reducer,
  foldersActions,
  folderSelectors,
  foldersSagas
};