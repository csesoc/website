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

export type sliceState = {
  parentFolder: string;
  path: string;
  items: FileEntity[];
};
