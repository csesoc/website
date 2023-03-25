export type baseEntity = {
  id: string;
  name: string;
  parentId: string;
  type: string;
};

export type Folder = baseEntity;
export type File = {
  image?: string;
} & baseEntity;

// FileEntity is the type which contains both
// folders and files
export type FileEntity = Folder | File;

// PathObject is the type which specifies the name AND id of the
// folder we are currently in
export type PathObject = {
  folderName: string;
  folderId: string;
};

export type sliceState = {
  parentFolder: string;
  path: PathObject[];
  items: FileEntity[];
};
