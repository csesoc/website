// FilesystemEntry is the contract for the type of response we receive from the backend
export type FilesystemEntry = {
    EntityID: string,
    EntityName: string,
    IsDocument: boolean,
    Parent: string,
    Children: FilesystemEntry[]
}

export type CreateFilesystemEntryResponse = {
    NewID: string
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const hasFieldOfType = (o: any, fieldName: string, type: string): boolean =>
    fieldName in o && (typeof o[fieldName]) === type;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const IsFilesystemEntry = (o: any): o is FilesystemEntry =>
    hasFieldOfType(o, "EntityID", "string") &&
    hasFieldOfType(o, "EntityName", "string") &&
    hasFieldOfType(o, "IsDocument", "boolean") &&
    hasFieldOfType(o, "Parent", "string") && 
    hasFieldOfType(o, "Children", typeof []) &&
    o.Children.every((child: any) => IsFilesystemEntry(child));

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const IsCreateFilesystemEntryResponse = (o: any): o is CreateFilesystemEntryResponse =>
    hasFieldOfType(o, "NewID", "string");
    