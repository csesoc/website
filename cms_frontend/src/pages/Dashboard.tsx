import React, { useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, IconButton } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import SideBar from 'src/components/SideBar/SideBar';
import FileRenderer from 'src/components/FileRenderer/FileRenderer';
import NewDialogue from 'src/components/NewDialogue/NewDialogue';

// Cast JSON format to HashMap
import type { FileFormat } from "src/types/FileFormat";
import Files from "src/data/DummyFiles";

// Heading to display current directory, separated out to avoid inline styling
const Directory = styled.h3`
  display: inline-block;
  margin-left: 20px;
  margin-right: 10px;
`;

const Dashboard: React.FC = () => {
  const [dir, setDir] = useState("root");
  const [folder, setFolder] = useState(Files.get(dir) as FileFormat[]);

  // Modal state handler
  const [modalOpen, setModalOpen] = React.useState(false);

  // Modal closer
  const handleModalClose = () => {
    setModalOpen(false);
  }

  // Gets the parent directory of our current directory, does not check
  // if that directory exists
  const getParent = () => {
    return dir.split("/").slice(0, -1).join("/");
  }

  // Moves our current directory up (analogous to `cd ..`)
  const toParent = () => {
    const parent = getParent();
    setDir(parent);
    setFolder(Files.get(parent) as FileFormat[]);
  }

  // Checks if our current directory has a parent directory
  const hasParent = () => {
    const parent = getParent();
    let found = false;

    Files.forEach((_, key) => {
      if (key === parent) {
        found = true;
      }
    });

    return found;
  }

  // Checks if a file/folder name already exists in our current directory
  const containsFilename = (name: string, type: string) => {
    for (const item of folder) {
      if (item.type === type && name === item.filename) {
        return true;
      }
    }

    return false;
  }

  // Updates our current folder state, also emitting it to the backend
  // TODO: change to an API call once that's up
  const updateFolder = (updated: FileFormat[]) => {
    setFolder(updated);
    Files.set(dir, updated);
  }

  // Finds the next available folder name
  const newFolderName = () => {
    let index = 0;
    let folder_name = "New Folder";

    while (containsFilename(folder_name, "folder")) {
      index++;
      folder_name = `New Folder (${index})`;
    }

    return folder_name;
  }

  // Creates a new folder with a generic name, like "New Folder (1)"
  const newFolder = () => {
    const name = newFolderName();

    Files.set(`${dir}/${name}`, []);

    let updated = Files.get(dir) as FileFormat[];
    updated = [...updated, {
      filename: name,
      type: "folder"
    }];

    updateFolder(updated);
  }

  // Listener when we click on a file in the current directory
  const fileClick = (name: string) => {
    // TODO: fill with API call
  }

  // Listener when we click on a folder in the current directory
  const folderClick = (name: string) => {
    const childName = `${dir}/${name}`;
    setDir(childName);
    setFolder(Files.get(childName) as FileFormat[]);
  }

  // Listener when we create a new file
  const newFile = () => {
    // TODO: fill with API call
    setModalOpen(true);
  }

  // Listener when we rename a file/folder
  // NOTE: doesn't recursively rename yet, hopefully backend
  // handles this properly
  const rename = (type: string, prev: string, curr: string) => {
    let curr_folder = Files.get(dir) as FileFormat[];
    let rename_index = -1;
    let same_name_index = -1;

    for (let i = 0; i < curr_folder.length; i++) {
      const item = curr_folder[i];

      if (item.filename === prev && item.type === type) {
        rename_index = i;
      }

      if (item.filename === curr) {
        same_name_index = i;
      }
    }

    if (rename_index === -1) {
      // TODO: error, cannot rename file that doesn't exist
      return;
    } else if (same_name_index !== -1) {
      const same_name = curr_folder[same_name_index];

      if (type === same_name.type) {
        // Can't have two files/folders have the same name,
        // but we can have a file have the same name as a folder
        return;
      }
    }

    // We have to map over again, since if we directly do
    // `curr_folder[rename_index].filename = curr` then we change
    // state outside of the `setFolder` function, breaking reactivity
    const updated = folder.map((item, index) => {
      if (index === rename_index) {
        return { ...item, filename: curr };
      } else {
        return item;
      }
    });

    updateFolder(updated);
  }

  return (
    <div style={{ display: 'flex' }}>
      <SideBar
        onNewFile={newFile}
        onNewFolder={newFolder} />
      <div style={{ flex: 1 }}>
        <Dialog
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="form-dialog-title">
          <DialogContent>
            <NewDialogue directory={dir} isCore={false} />
          </DialogContent>
        </Dialog>
        <Directory>{dir}</Directory>
        <IconButton
          disabled={!hasParent()}
          onClick={() => toParent()}
          style={{ display: "inline-block", border: "1px solid grey" }}>
          <ExpandLessIcon />
        </IconButton>
        <FileRenderer
          files={folder}
          onFileClick={fileClick}
          onFolderClick={folderClick}
          onRename={rename}
          onNewFile={newFile} />
      </div>
    </div>
  );
};

export default Dashboard;
