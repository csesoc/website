import { toFileOrFolder } from './helpers';
import { JSONFileFormat } from './types';

const DEFAULT_OWNER_GROUP = '1';

// Given a file ID (if no ID is provided root is assumed), returns
// a FileFormat of that file from the backend
export async function getFolder(id?: string) {
  const ending = id === undefined ? '' : `?EntityID=${id}`;
  const folder_resp = await fetch(`/api/filesystem/info${ending}`);

  if (!folder_resp.ok) {
    const message = `An error has occured: ${folder_resp.status}`;
    throw new Error(message);
  }
  const folder_json = await folder_resp.json();
  return toFileOrFolder(folder_json.Response);
}

// Given a file ID, sets the `contents` state variable to the children
// of that file
export async function updateContents(id: string) {
  // const id = getCurrentID();
  const children_resp = await fetch(`/api/filesystem/info?EntityID=${id}`);

  if (!children_resp.ok) {
    const message = `An error has occured: ${children_resp.status}`;
    throw new Error(message);
  }

  const children_json = await children_resp.json();
  const children = children_json.Response.Children.map(
    (child: JSONFileFormat) => {
      return toFileOrFolder(child);
    }
  );

  return children;
}

export const newFile = async (
  name: string,
  parentID: string
): Promise<string> => {
  // This isn't attached to the parent folder yet,
  // TODO: patch once auth is finished
  const create_resp = await fetch('/api/filesystem/create', {
    method: 'POST',
    body: new URLSearchParams({
      LogicalName: name,
      Parent: parentID.toString(),
      OwnerGroup: DEFAULT_OWNER_GROUP,
      IsDocument: 'true',
    }),
  });

  if (!create_resp.ok) {
    const message = `An error has occured: ${create_resp.status}`;
    throw new Error(message);
  }
  const response = await create_resp.json();

  console.log(response);
  console.log(JSON.stringify(response));
  return response.Response.NewID;
};

export const newFolder = async (
  name: string,
  parentID: string
): Promise<string> => {
  // TODO: patch once auth is finished
  const create_resp = await fetch('/api/filesystem/create', {
    method: 'POST',
    body: new URLSearchParams({
      LogicalName: name,
      Parent: parentID.toString(),
      OwnerGroup: DEFAULT_OWNER_GROUP,
      IsDocument: 'false',
    }),
  });

  if (!create_resp.ok) {
    const message = `An error has occured: ${create_resp.status}`;
    throw new Error(message);
  }
  const response = await create_resp.json();
  return response.Response.NewID;
};

export const renameFileEntity = async (
  fileEntityID: string,
  fileEntityNewName: string
): Promise<void> => {
  const rename_resp = await fetch('/api/filesystem/rename', {
    method: 'POST',
    body: new URLSearchParams({
      EntityID: fileEntityID,
      NewName: fileEntityNewName,
    }),
  });

  if (!rename_resp.ok) {
    const message = `An error has occured: ${rename_resp.status}`;
    throw new Error(message);
  }
  const response = await rename_resp.json();

  console.log(response);
  return;
};

export const deleteFileEntity = async (fileEntityID: string): Promise<void> => {
  const delete_resp = await fetch('/api/filesystem/delete', {
    method: 'POST',
    body: new URLSearchParams({
      EntityID: fileEntityID,
    }),
  });

  if (!delete_resp.ok) {
    const message = `An error has occured: ${delete_resp.status}`;
    throw new Error(message);
  }
  const response = await delete_resp.json();

  console.log(response);
  return;
};
