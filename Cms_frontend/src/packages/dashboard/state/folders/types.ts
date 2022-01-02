type baseEntity = {
  id: number,
  name: string,
}

export type Folder = {} & baseEntity;

export type File = {
  isDocument: boolean
} &baseEntity;

export type sliceState = {
  items: (Folder | File)[];
}

