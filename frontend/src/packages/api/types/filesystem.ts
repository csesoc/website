// FilesystemEntry is the contract for the type of response we receive from the backend
export type FilesystemEntry = {
    EntityID: string,
    EntityName: string,
    IsDocument: boolean,
    Parent: string,
    Children: FilesystemEntry[]
}

export type CreateFilesystemEntryResponse = {
    EntityID: string
}