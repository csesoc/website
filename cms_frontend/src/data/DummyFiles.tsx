import type FileFormat from "src/types/FileFormat";
import FilesRaw from "./dummy_structure.json";

type FolderName = keyof typeof FilesRaw;

const Files = new Map<string, FileFormat[]>();

for (const key in FilesRaw) {
  Files.set(key, FilesRaw[key as FolderName]);
}

export default Files;
