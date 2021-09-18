import React from 'react';
import styled from 'styled-components';

import FolderContainer from "./FolderContainer";
import FileContainer from "./FileContainer";

import Default from "src/images/default.png";
import NewPost from "src/images/new_post.png";

import type { FileFormat } from "src/types/FileFormat";

const FileFlex = styled.div`
  width: 24%;
`

// type declaration for props
interface RenderProps {
  files: FileFormat[],
  // Functions for user interactions - when they click on an
  // existing file, when they click on a folder, and when they make
  // a new file respectively
  onFileClick: (name: string) => void,
  onFolderClick: (name: string) => void,
  onRename: (type: string, prev: string, next: string) => void,
  onNewFile: () => void,
  activeFiles: string
}

// Given a list of files specified in FileFormat, sorts them alphabetically,
// with folders first, then followed by files
const sortFiles = (files: FileFormat[]) => {
  return files.sort((first, second) => {
    if (first.type !== second.type) {
      if (first.type === "folder") {
        return -1;
      } else {
        return 1;
      }
    }

    // Alphabetically compare filenames if they have the same type
    return first.filename.localeCompare(second.filename);
  });
};

// Typescript Declaration
// uses the interface defined above
// imports the icons from material UI
const FileRenderer: React.FC<RenderProps> = ({ files, onFileClick, onFolderClick, onRename, onNewFile, activeFiles }) => {
  const sorted = sortFiles(files);

  return (
    // Mapping over all files given from Dashboard, with a little bit
    // of inline styling to facilitate flex divs
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {sorted.map((file, index) => (
        <FileFlex key={file.filename + index}>
          {file.type === "folder" && (
            <FolderContainer
              filename={file.filename}
              onClick={() => onFolderClick(file.filename)}
              onRename={(prev, next) => onRename("folder", prev, next)} />
          )}
          {file.type === "file" && (
            <FileContainer
              filename={file.filename}
              image={Default}
              onClick={() => onFileClick(file.filename)}
              active={activeFiles===file.filename}
              onRename={(prev, next) => onRename("file", prev, next)} />
          )}
        </FileFlex>
      ))}
      <FileFlex>
        <FileContainer
          filename="New"
          image={NewPost}
          onClick={onNewFile}
          active={false} />
      </FileFlex>
    </div>
  )
}

export default FileRenderer;
