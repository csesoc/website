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

export function updateContent(state: editorState, action: PayloadAction<BlockInfo>): editorState {
  const { id, data } = action.payload;
  return {
    contents: state.contents.map((block) => {
      if (block.id == id) {
        return ({
          ...block,
          data: data,
        })
      }
      return block;
    })
  }
}