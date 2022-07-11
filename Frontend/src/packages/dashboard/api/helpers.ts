import { useSelector } from "react-redux";
import { RootState } from "../../../redux-state/reducers";

import { JSONFileFormat } from "./types";
import { folderSelectors } from "../state/folders";
import { FileEntity, sliceState } from "../state/folders/types";


// Converts a backend response to the File or Folder type
export function toFileOrFolder(json: JSONFileFormat): FileEntity {
  const {EntityID, EntityName, IsDocument, Parent} = json;

  return {
    id: EntityID,
    name: EntityName,
    parentId: Parent,
    type: IsDocument ? "File" : "Folder",
  } as FileEntity
}

export function getFolderState(): sliceState  {
  return useSelector((state: RootState) => (
    folderSelectors.getFolderState(state)
  ));
}