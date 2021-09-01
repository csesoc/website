import React, { useState } from 'react';
import styled from 'styled-components';
import { IconButton } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import SideBar from 'src/components/SideBar/SideBar';
import FileRenderer from 'src/components/FileRenderer/FileRenderer';
import FileContainer from 'src/components/FileRenderer/FileContainer';

import NewPost from "src/images/new_post.png";
import Files from "src/data/dummy_structure.json";
type FolderName = keyof typeof Files;

interface FileFormat {
  filename: string,
  type: string
}

const Directory = styled.h3`
  display: inline-block;
  margin-left: 20px;
  margin-right: 10px;
`;

const sortFiles = (files: FileFormat[]) => {
  return files.sort((first, second) => {
    if (first.type !== second.type) {
      if (first.type === "folder") {
        return -1;
      } else {
        return 1;
      }
    }

    return first.filename.localeCompare(second.filename);
  });
};

const Dashboard: React.FC = () => {
  const [dir, setDir] = useState("root" as FolderName);

  const getParent = () => {
    return dir.split("/").slice(0, -1).join("/");
  }

  const toParent = () => {
    const parent = getParent() as FolderName;
    setDir(parent);
  }

  const hasParent = () => {
    const parent = getParent();

    for (const key in Files) {
      if (parent === key) {
        return true;
      }
    }

    return false;
  }

  const fileClick = (name: string) => {
    // TODO: fill with API call
  }

  const folderClick = (name: string) => {
    const childName = `${dir}/${name}` as FolderName;
    setDir(childName);
  }

  const createFile = () => {
    // TODO: fill with API call
  }

  // map function maps out all the objects
  // there is inline styling, use with caution
  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div style={{ flex: 1 }}>
        <Directory>{dir}</Directory>
        <IconButton
          disabled={!hasParent()}
          onClick={() => toParent()}
          style={{ display: "inline-block", border: "1px solid grey" }}>
          <ExpandLessIcon />
        </IconButton>
        <div style={{ display: 'flex' }}>
          {sortFiles(Files[dir]).map((file, index) => {
            return (
              <div style={{ flexBasis: "25%" }}>
                <FileRenderer
                  key={index}
                  filename={file.filename}
                  type={file.type}
                  onFileClick={() => fileClick(file.filename)}
                  onFolderClick={() => folderClick(file.filename)} />
              </div>
            )
          })}
          <FileContainer
            filename="New"
            onClick={() => createFile()}
            image={NewPost} />
        </div>
      </div>
    </div>
  )
};

export default Dashboard;
