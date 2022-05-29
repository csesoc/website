import { createAction } from "@reduxjs/toolkit";

export type updatePayloadType = {
  id: number
  newData: JSON
}

/**
 * Content actions
 */
export const updateContent = createAction<updatePayloadType>("editor/updateContent");