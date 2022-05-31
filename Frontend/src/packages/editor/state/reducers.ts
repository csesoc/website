import { PayloadAction } from "@reduxjs/toolkit";
import { editorState, BlockInfo } from "./types";


export function addContentBlock(state: editorState, action: PayloadAction<BlockInfo>): editorState {
  return {
    contents: [
      ...state.contents,
      action.payload,
    ]
  }
}