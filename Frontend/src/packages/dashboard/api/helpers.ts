import { FileEntity } from "../state/folders/types";
import { JSONFileFormat } from "./types";

// Converts a backend response to the File or Folder type
export function toFileOrFolder(json: JSONFileFormat): FileEntity {
  const {EntityID, EntityName, IsDocument} = json;

  return {
    id: EntityID,
    name: EntityName,
    type: IsDocument ? "File" : "Folder",
  } as FileEntity
}