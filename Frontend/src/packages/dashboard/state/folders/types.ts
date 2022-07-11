export type baseEntity = {
  id: number,
  name: string,
  parentId: number,
  type: string,
}

export type Folder = baseEntity
export type File = {
  image?: string,
} & baseEntity;

// FileEntity is the type which contains both
// folders and files
export type FileEntity = Folder | File;

export type sliceState = {
  parentFolder: number
  path: string
  items: (FileEntity)[];
}

