import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, IconButton } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import SideBar from 'src/packages/dashboard/components/SideBar/SideBar';
import FileRenderer from 'src/deprecated/components/FileRenderer_OLD/FileRenderer';
import NewDialogue from 'src/deprecated/components/NewDialogue/NewDialogue';

// Cast JSON format to HashMap
import type { FileFormat } from "src/deprecated/types/FileFormat";

// Heading to display current directory, separated out to avoid inline styling
const DirectoryName = styled.h3`
  display: inline-block;
  margin-left: 20px;
  margin-right: 10px;
`;

// TODO extract to external file
interface JSONFileFormat {
	EntityID: number,
	EntityName: string,
	IsDocument: boolean
}

// Implementation
const Dashboard: React.FC = () => {
	// TODO: implement loading screen
	const [loading, setLoading] = useState(true);
	const [dir, setDir] = useState<FileFormat[]>([]);
	const [contents, setContents] = useState<FileFormat[]>([]);
	const [activeFiles, setActiveFiles] = useState(-1);
	// Modal state handler
	const [modalOpen, setModalOpen] = React.useState(false);

	// Converts a backend response to the local FileFormat interface
	const toFileFormat = (json: JSONFileFormat): FileFormat => {
		return {
			id: json.EntityID,
			filename: json.EntityName,
			isDocument: json.IsDocument
		};
	}

	// Given a file ID (if no ID is provided root is assumed), returns
	// a FileFormat of that file from the backend
	const getFolder = async (id?: number) => {
		const ending = (id === undefined) ? "" : `?EntityID=${id}`;
		const folder_resp = await fetch(`http://localhost:8080/filesystem/info${ending}`);

		if (!folder_resp.ok) {
			const message = `An error has occured: ${folder_resp.status}`;
			throw new Error(message);
		}

		const folder_json = await folder_resp.json();
		return toFileFormat(folder_json.body.response);
	}

  // Get the file ID of the current directory
	const getCurrentID = () => {
		return dir[dir.length - 1].id;
	}

	// Given a file ID, sets the `contents` state variable to the children
	// of that file
	const updateContents = async () => {
    const id = getCurrentID();
		const children_resp = await fetch(`http://localhost:8080/filesystem/children?EntityID=${id}`);

		if (!children_resp.ok) {
			const message = `An error has occured: ${children_resp.status}`;
			throw new Error(message);
		}

		const children_json = await children_resp.json();
		const children = children_json.body.response.map((child: JSONFileFormat) => {
			return toFileFormat(child);
		});

		setContents(children);
	}

	// Initialise the root folder, in its separate function because useEffect
	// won't allow async functions
	const initRoot = async () => {
		const root = await getFolder();
		setDir([root]);
		setActiveFiles(root.id);
		setLoading(false);
	}

	// Triggers when Dashboard first loads
	useEffect(() => {
		// TODO: store cookie on where the user last visited
		initRoot();
	}, []);

	// Update the `contents` state variable whenever we switch directories -
	// not sure if this is completely stateful but it works
	useEffect(() => {
		if (dir.length > 0) {
			updateContents();
		}
	}, [dir]);

	// Modal closer
	const closeModal = () => {
		setModalOpen(false);
	}

	// Gets the full directory name
	const getDirName = () => {
		return dir.map(file => file.filename).join("/");
	}

	// Moves our current directory up (analogous to `cd ..`)
	const toParent = () => {
		setDir(dir.slice(0, -1));
	}

	// Checks if our current directory has a parent directory
	const hasParent = () => {
		return dir.length > 1;
	}

	// Checks if a file/folder name already exists in our current directory
	const containsFilename = (name: string, isDocument: boolean) => {
		for (const item of contents) {
			if (item.isDocument === isDocument && name === item.filename) {
				return true;
			}
		}

		return false;
	}

	// Finds the next available folder name
	const newFolderName = () => {
		let index = 0;
		let folder_name = "New Folder";

		while (containsFilename(folder_name, false)) {
			index++;
			folder_name = `New Folder (${index})`;
		}

		return folder_name;
	}

	// Creates a new folder with a generic name, like "New Folder (1)"
	const newFolder = async () => {
		setLoading(true);
		const folder_name = newFolderName();

		// This isn't attached to the parent folder yet,
		// TODO: patch once auth is finished
		const create_resp = await fetch("http://localhost:8080/filesystem/create", {
			method: "POST",
			body: new URLSearchParams({
				"LogicalName": folder_name,
				"OwnerGroup": "1",
				"IsDocument": "false"
			})
		});

		if (!create_resp.ok) {
			const message = `An error has occured: ${create_resp.status}`;
			throw new Error(message);
		}

		await updateContents();
		setLoading(false);
	}

	// Listener when we click on a file in the current directory
	const fileClick = (id: number) => {
		// TODO: fill with API call
		setActiveFiles(id);
	}

  const folderClick = async (id: number) => {
    setActiveFiles(id);
  }

	// Listener when we click on a folder in the current directory
	const folderDoubleClick = async (id: number) => {
		const child = await getFolder(id);
		setDir([...dir, child]);
	}

	// Listener when we create a new file
	const newFile = () => {
		// TODO: fill with API call
		setModalOpen(true);
	}

	// Checks if a file can (or needs to) be renamed
	const canRename = (updated: FileFormat) => {
		let rename_index = -1;
		let same_name_index = -1;

		for (let i = 0; i < contents.length; i++) {
			const item = contents[i];

			if (item.id === updated.id && item.isDocument === updated.isDocument) {
				rename_index = i;
				continue;
			}

			if (item.filename === updated.filename) {
				same_name_index = i;
			}
		}

		if (rename_index === -1) {
			// TODO: error, cannot rename file that doesn't exist
			return false;
		} else if (contents[rename_index].filename === updated.filename) {
			// We didn't change the name at all, no request needed
			return false;
		} else if (same_name_index !== -1) {
			const same_name = contents[same_name_index];

			if (updated.isDocument === same_name.isDocument) {
				// Can't have two files/folders have the same name,
				// but we can have a file have the same name as a folder
				return false;
			}
		}

		return true;
	}

	// Listener when we rename a file/folder
	const rename = async (updated: FileFormat) => {
		setLoading(true);

		if (!canRename(updated)) {
			setLoading(false);
			return;
		}

		const rename_resp = await fetch("http://localhost:8080/filesystem/rename", {
			method: "POST",
			body: new URLSearchParams({
				"EntityID": updated.id.toString(),
				"NewName": updated.filename
			})
		});

		if (!rename_resp.ok) {
			const message = `An error has occured: ${rename_resp.status}`;
			throw new Error(message);
		}

		await updateContents();
		setLoading(false);
	}

  const recycle = async () => {
    setLoading(true);

    const recycle_resp = await fetch("http://localhost:8080/filesystem/delete", {
      method: "POST",
      body: new URLSearchParams({
        "EntityID": activeFiles.toString()
      })
    });

    if (!recycle_resp.ok) {
			const message = `An error has occured: ${recycle_resp.status}`;
			throw new Error(message);
		}

    await updateContents();
    setLoading(false);
  }

	return (
        <div style={{ display: 'flex' }}>
			{/* <SideBar
				onNewFile={newFile}
				onNewFolder={newFolder}
        onRecycle={recycle} /> */}
			{!loading && (
				<div style={{ flex: 1 }}>
					<Dialog
						open={modalOpen}
						onClose={closeModal}
						aria-labelledby="form-dialog-title">
						<DialogContent>
							<NewDialogue directory={getDirName()} isCore={false} />
						</DialogContent>
					</Dialog>
					<DirectoryName>{getDirName()}</DirectoryName>
					<IconButton
                        disabled={!hasParent()}
                        onClick={() => toParent()}
                        style={{ display: "inline-block", border: "1px solid grey" }}
                        size="large">
						<ExpandLessIcon />
					</IconButton>
					<FileRenderer
						files={contents}
						activeFiles={activeFiles}
						onFileClick={fileClick}
						onFolderClick={folderClick}
            onFolderDoubleClick={folderDoubleClick}
						onRename={rename}
						onNewFile={newFile} />
				</div>
			)}
		</div>
    );
};

export default Dashboard;
