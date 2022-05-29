import { PayloadAction } from "@reduxjs/toolkit";
import { updatePayloadType } from "./actions";
import { editorState } from "./types";

export function updateContent(state: editorState, action: PayloadAction<updatePayloadType>): editorState {
  const { id, newData } = action.payload;
  return {
    contents: state.contents.map((block) => {
      if (block.id == id) {
        return ({
          ...block,
          data: newData,
        })
      }
      return block;
    })
  }
}