import React, { useState } from 'react';
import styled from 'styled-components';
import { IconButton } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import SideBar from 'src/components/SideBar/SideBar';
import FileRenderer from 'src/components/FileRenderer/FileRenderer';

// Cast JSON format to HashMap
import type FileFormat from "src/types/FileFormat";
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

  const containsFilename = (name: string) => {
    for (const item of folder) {
      if (name === item.filename) {
        return true;
      }
    }

    return false;
  }

  const updateFolder = (updated: FileFormat[]) => {
    setFolder(updated);
    Files.set(dir, updated);
  }

  const newFolderName = () => {
    let index = 0;
    let folder_name = "New Folder";

    while (containsFilename(folder_name)) {
      index++;
      folder_name = `New Folder (${index})`;
    }

    return folder_name;
  }

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

  const fileClick = (name: string) => {
    // TODO: fill with API call
  }

  const folderClick = (name: string) => {
    const childName = `${dir}/${name}`;
    setDir(childName);
    setFolder(Files.get(childName) as FileFormat[]);
  }

  const newFile = () => {
    // TODO: fill with API call
  }

  const rename = (prev: string, curr: string) => {
    let curr_folder = Files.get(dir) as FileFormat[];
    let rename_index = -1;

    for (let i = 0; i < curr_folder.length; i++) {
      const item = curr_folder[i];

      if (item.filename === prev) {
        rename_index = i;
      }

      if (item.filename === curr) {
        // Prevent renaming, we can't name something
        // to a name that already exists
        return;
      }
    }

    if (rename_index === -1) {
      // TODO: error, cannot rename file that doesn't exist
      return;
    }

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
        onNewFolder={newFolder} />
      <div style={{ flex: 1 }}>
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
