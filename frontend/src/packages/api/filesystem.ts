import { APIError, EmptyAPIResponse } from "./types";

// FilesystemEntry is the contract for the type of response we receive from the backend
export type FilesystemEntry = {
    EntityID: string,
    EntityName: string,
    IsDocument: boolean,
    Parent: string,
    Children: FilesystemEntry[]
}

export type CreateFsEntryResponse = {
    EntityID: string
}

// PostBodies is an internal discriminated union of supported post bodies
type PostBody = 
    | { $type: "Record", body: Record<string, string> }
    | { $type: "FormData", body: FormData }

// Only interface with the BE FS APIs via this class
export class FilesystemAPI {
    public static GetEntityInfo = (EntityID: string): Promise<FilesystemEntry | APIError> => 
        FilesystemAPI.SendGetRequest<FilesystemEntry>(`/api/filesystem/info?EntityID=${EntityID}`);
    
    public static CreateEntity = (name: string, parentId: string): Promise<CreateFsEntryResponse | APIError> =>
        FilesystemAPI.SendPostRequest<CreateFsEntryResponse>("/api/filesystem/create", {
            $type: "Record", 
            body: {
                "LogicalName": name,
                "Parent": parentId,
                "OwnerGroup": "1",
                "IsDocument": "true",
            }
        });
    
    public static PublishEntity = (EntityID: string): Promise<EmptyAPIResponse | APIError> => {
        const body = new FormData();
        body.append("DocumentID", EntityID);

        return FilesystemAPI.SendPostRequest<EmptyAPIResponse>("/api/filesystem/publish-document", {
            $type: "FormData",
            body: body
        });
    }


    static async SendGetRequest<ResponseType> (url: string): Promise<ResponseType | APIError> {
        const response = await fetch(url);
        return response.ok
            ? (await response.json()) as ResponseType
            : (await response.json()) as APIError;
    }

    static async SendPostRequest<ResponseType> (url: string, body: PostBody): Promise<ResponseType | APIError> {
        const response = await fetch(url, {
            method: "POST",
            body: body.$type === "Record"
                    ? new URLSearchParams(body.body)
                    : body.body
        });

        return response.ok
            ? (await response.json()) as ResponseType
            : (await response.json()) as APIError;
    } 
}