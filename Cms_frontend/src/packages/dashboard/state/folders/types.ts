export type baseEntity = {
  id: number,
  name: string,
  type: string,
}

export type Folder = baseEntity
export type File = {
  image: string,
} & baseEntity;

// FileEntity is the type which contains both
// folders and files
export type FileEntity = Folder | File;

export type sliceState = {
  path: string
  items: (FileEntity)[];
}

