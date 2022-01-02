import { File,Folder } from "../state/folders/types";
import { JSONFileFormat } from "./types";

// Converts a backend response to the File or Folder type
export function toFileOrFolder(json: JSONFileFormat): (File|Folder) {
  const {EntityID, EntityName, IsDocument} = json;
  console.log(IsDocument);
  // if file
  if(IsDocument) {
    return {
      id: EntityID,
      name: EntityName,
      isDocument: IsDocument
    } as File;
  }

  // else is folder
  return {
    id: EntityID,
    name: EntityName,
  } as Folder;
}