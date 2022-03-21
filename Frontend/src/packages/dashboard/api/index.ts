import {getFolderState, toFileOrFolder} from './helpers';
import { BACKEND_URI } from 'src/config';
import { JSONFileFormat } from './types';

// Given a file ID (if no ID is provided root is assumed), returns
// a FileFormat of that file from the backend
export async function getFolder (id?: number) {
  const ending = (id === undefined) ? "?EntityID=0" : `?EntityID=${id}`;
  const folder_resp = await fetch(`${BACKEND_URI}/filesystem/info${ending}`);

  if (!folder_resp.ok) {
    const message = `An error has occured: ${folder_resp.status}`;
    throw new Error(message);
  }
  const folder_json = await folder_resp.json();
  return toFileOrFolder(folder_json.Response);
}


// Given a file ID, sets the `contents` state variable to the children
// of that file
export async function updateContents(id: number) {
  // const id = getCurrentID();
  const children_resp = await fetch(`${BACKEND_URI}/filesystem/info?EntityID=${id}`);

  if (!children_resp.ok) {
    const message = `An error has occured: ${children_resp.status}`;
    throw new Error(message);
  }

  const children_json = await children_resp.json();
  console.log(children_json)
  const children = children_json.Response.Children.map((child: JSONFileFormat) => {
    return toFileOrFolder(child);
  });

  return children;

}


export const newFile = async (name: string): Promise<string> => {

  // This isn't attached to the parent folder yet,
  // TODO: patch once auth is finished
  const create_resp = await fetch("http://localhost:8080/filesystem/create", {
    method: "POST",
    body: new URLSearchParams({
      "LogicalName": name,
      "ParentFileID": getFolderState().parentFolder.toString(),
      "OwnerGroup": "1",
      "IsDocument": "true",
    })
  });

  if (!create_resp.ok) {
    const message = `An error has occured: ${create_resp.status}`;
    throw new Error(message);
  }
  const response = await create_resp.json();
  return response.Response.NewID;
}

export const newFolder = async (name: string): Promise<string> => {

  console.log(name)
  // This isn't attached to the parent folder yet,
  // TODO: patch once auth is finished
  const create_resp = await fetch("http://localhost:8080/filesystem/create", {
    method: "POST",
    body: new URLSearchParams({
      "LogicalName": name,
      "ParentFileID": getFolderState().parentFolder.toString(),
      "OwnerGroup": "1",
      "IsDocument": "false",
    })
  });

  if (!create_resp.ok) {
    const message = `An error has occured: ${create_resp.status}`;
    throw new Error(message);
  }
  const response = await create_resp.json();
  return response.Response.NewID;
}

