import { sliceState } from "./types";

const ROOT_UUID = "00000000-0000-0000-0000-000000000000";

export const initialState: sliceState = {
  parentFolder: ROOT_UUID,
  path: [{ folderName: "root", folderId: ROOT_UUID }],
  items: [],
};
