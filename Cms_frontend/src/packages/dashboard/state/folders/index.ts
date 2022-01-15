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

  // init reducers
  builder.addCase(foldersActions.initItemsAction, reducerFns.setItems);
})

export { 
  reducer,
  foldersActions,
  folderSelectors,
  foldersSagas
};