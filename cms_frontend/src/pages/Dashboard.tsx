import React, { useState } from 'react';

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
}

const Dashboard: React.FC = () => {
  const [dir, setDir] = useState("root" as FolderName);

  const toParent = () => {
    const parent = dir.split("/").slice(0, -1).join("/") as FolderName;
    setDir(parent);
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
      <div style={{ flex: 1, display: 'inline-block' }}>
        <p>{dir}</p>
        <button onClick={() => toParent()}>^</button>
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
}

export default Dashboard;
