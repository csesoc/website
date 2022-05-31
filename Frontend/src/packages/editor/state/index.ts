import  { createReducer } from "@reduxjs/toolkit";
import { initialState } from './initial-state';
import  * as reducerFns from './reducers';
import * as editorActions from './actions';

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(editorActions.addContentBlock, reducerFns.addContentBlock);
})

export {
  reducer
};