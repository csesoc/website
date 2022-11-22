import { CreateFilesystemEntryResponse, FilesystemEntry } from "./types/filesystem";
import { APIError, EmptyAPIResponse } from "./types/general";

// PostBody is an internal discriminated union of supported post bodies
type PostBody = 
    | { $type: "Record"; body: Record<string, string> }
    | { $type: "FormData"; body: FormData };

// TODO: not this
// This was the best way I could figure out how to get actual integration tests to run in the frontend container
let API_URL = "";

export const configureApiUrl = (newUrl: string): void => { API_URL = newUrl };
export const resetApiUrl = (): void => { API_URL = "" };

// Only interface with the BE FS APIs via this class
export class FilesystemAPI {
    // GetEntityInfo retrieves all entity information for an FS entity given its ID
    public static GetEntityInfo = (EntityID: string): Promise<FilesystemEntry | APIError> => 
        FilesystemAPI.SendGetRequest<FilesystemEntry>(`/api/filesystem/info?EntityID=${EntityID}`);
    
    // GetRootInfo retrieves filesystem information for the file tree root
    public static GetRootInfo = (): Promise<FilesystemEntry | APIError> =>
        FilesystemAPI.SendGetRequest<FilesystemEntry>(`/api/filesystem/info`);

    // CreateEntity constructs an editable un-published filesystem entry
    public static CreateDocument = (Name: string, ParentID: string, ownerGroup = 1): Promise<CreateFilesystemEntryResponse | APIError> => 
        FilesystemAPI.CreateFilesystemEntity(Name, ParentID, true, ownerGroup);

    // CreateDirectory creates a new directory in our FS tree
    public static CreateDirectory = (Name: string, ParentID: string, ownerGroup = 1): Promise<CreateFilesystemEntryResponse | APIError> => 
        FilesystemAPI.CreateFilesystemEntity(Name, ParentID, false, ownerGroup);

    // PublishEntity publishes a filesystem entity, ie it makes the entity visible for all users accessing our content
    public static PublishEntity = (EntityID: string): Promise<EmptyAPIResponse | APIError> => {
        const body = new FormData();
        body.append("DocumentID", EntityID);

        return FilesystemAPI.SendPostRequest<EmptyAPIResponse>("/api/filesystem/publish-document", {
            $type: "FormData",
            body: body,
        });
    }

    // DeleteEntity removes an entity from our filesystem tree given its ID
    public static DeleteEntity = (EntityID: string): Promise<EmptyAPIResponse | APIError> =>
        FilesystemAPI.SendPostRequest("/api/filesystem/delete", {
            $type: "Record",
            body: { EntityID },
        });
    
    // RenameEntity renames an entity given is FS entity ID
    public static RenameEntity = (EntityID: string, NewName: string): Promise<EmptyAPIResponse | APIError> =>
        FilesystemAPI.SendPostRequest("/api/filesystem/rename", {
            $type: "Record",
            body: { EntityID, NewName },
        });

    // CreateFilesystemEntity is a small helper function for easily creating filesystem entities
    static CreateFilesystemEntity = (LogicalName: string, ParentID: string, IsDocument: boolean, OwnerGroup = 1): Promise<CreateFilesystemEntryResponse | APIError> =>
        FilesystemAPI.SendPostRequest<CreateFilesystemEntryResponse>("/api/filesystem/create", {
            $type: "Record", 
            body: {
                LogicalName,
                "Parent": ParentID,
                "OwnerGroup": `${OwnerGroup}`,
                "IsDocument": `${IsDocument}`,
            },
        });

    // SendGetRequest is a small helper functions for sending get request and wrapping the response in an appropriate type
    static async SendGetRequest<ResponseType> (url: string): Promise<ResponseType | APIError> {
        const response = await fetch(`${API_URL}${url}`);
        return response.ok
            ? (await response.json()).Response as ResponseType
            : (await response.json()) as APIError;
    }

    // SendPostRequest is a small helper function for sending post requests and wrapping the response in appropriate types
    static async SendPostRequest<ResponseType> (url: string, body: PostBody): Promise<ResponseType | APIError> {
        const response = await fetch(`${API_URL}${url}`, {
            method: "POST",
            body: body.$type === "Record"
                    ? new URLSearchParams(body.body)
                    : body.body,
        });

        return response.ok
            ? (await response.json()).Response as ResponseType
            : (await response.json()) as APIError;
    } 
}