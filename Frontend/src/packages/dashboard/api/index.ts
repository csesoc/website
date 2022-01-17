import { toFileOrFolder } from './helpers';
import { BACKEND_URI } from 'src/config';
import { JSONFileFormat } from './types';

// Given a file ID (if no ID is provided root is assumed), returns
// a FileFormat of that file from the backend
export async function getFolder (id?: number) {
  const ending = (id === undefined) ? "" : `?EntityID=${id}`;
  const folder_resp = await fetch(`${BACKEND_URI}/filesystem/info${ending}`);

  if (!folder_resp.ok) {
    const message = `An error has occured: ${folder_resp.status}`;
    throw new Error(message);
  }

  const folder_json = await folder_resp.json();
  return toFileOrFolder(folder_json.body.response);
}


// Given a file ID, sets the `contents` state variable to the children
// of that file
export async function updateContents(id: number) {
  // const id = getCurrentID();
  const children_resp = await fetch(`${BACKEND_URI}/filesystem/children?EntityID=${id}`);

  if (!children_resp.ok) {
    const message = `An error has occured: ${children_resp.status}`;
    throw new Error(message);
  }

  const children_json = await children_resp.json();
  const children = children_json.body.response.map((child: JSONFileFormat) => {
    return toFileOrFolder(child);
  });

  return children;

}
