import { createAction } from "@reduxjs/toolkit";
import { BlockInfo } from "./types";

/**
 * Content actions
 */
export const addContentBlock = createAction<BlockInfo>("editor/createContentBlock");
export const updateContent = createAction<BlockInfo>("editor/updateContent");

