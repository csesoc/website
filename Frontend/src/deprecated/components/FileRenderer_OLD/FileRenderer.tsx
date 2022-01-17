import React from 'react';
import styled from 'styled-components';

import FolderContainer from "./FolderContainer";
import FileContainer from "./FileContainer";

import Default from "src/images/default.png";
import NewPost from "src/images/new_post.png";

import type { FileFormat } from "src/deprecated/types/FileFormat";

const FileFlex = styled.div`
  width: 24%;
`

// type declaration for props
interface RenderProps {
  files: FileFormat[],
  activeFiles: number,
  // Functions for user interactions - when they click on an
  // existing file, when they click on a folder, and when they make
  // a new file respectively
  onFileClick: (id: number) => void,
  onFolderClick: (id: number) => void,
  onFolderDoubleClick: (id: number) => void,
  onRename: (updated: FileFormat) => void,
  onNewFile: () => void
}

// Given a list of files specified in FileFormat, sorts them alphabetically,
// with folders first, then followed by files
const sortFiles = (files: FileFormat[]) => {
  return files.sort((first, second) => {
    if (first.isDocument !== second.isDocument) {
      return first.isDocument ? 1 : -1;
    }

    // Alphabetically compare filenames if they have the same type
    return first.filename.localeCompare(second.filename);
  });
};

// Typescript Declaration
// uses the interface defined above
// imports the icons from material UI
const FileRenderer: React.FC<RenderProps> = ({ files,  activeFiles, onFileClick, onFolderClick, onFolderDoubleClick, onRename, onNewFile }) => {
  const sorted = sortFiles(files);

  return (
    // Mapping over all files given from Dashboard, with a little bit
    // of inline styling to facilitate flex divs
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {sorted.map((file, index) => (
        <FileFlex key={file.filename + index}>
          {file.isDocument ? (
            <FileContainer
              filename={file.filename}
              image={Default}
              active={activeFiles === file.id}
              onClick={() => onFileClick(file.id)}
              onRename={(newName) => onRename({
                id: file.id,
                filename: newName,
                isDocument: true
              })} />
          ) : (
            <FolderContainer
              filename={file.filename}
              active={activeFiles === file.id}
              onClick={() => onFolderClick(file.id)}
              onDoubleClick={() => onFolderDoubleClick(file.id)}
              onRename={(newName) => onRename({
                id: file.id,
                filename: newName,
                isDocument: false
              })} />
          )}
        </FileFlex>
      ))}
      <FileFlex>
        <FileContainer
          filename="New"
          image={NewPost}
          active={false}
          onClick={onNewFile} />
      </FileFlex>
    </div>
  )
}

export default FileRenderer;
