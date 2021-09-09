import React from 'react';

import FolderContainer from "./FolderContainer";
import FileContainer from "./FileContainer";

import Default from "src/images/default.png";
import NewPost from "src/images/new_post.png";

import type { FileFormat } from "src/types/FileFormat";

// type declaration for props
interface RenderProps {
  files: FileFormat[],
  // Functions for user interactions - when they click on an
  // existing file, when they click on a folder, and when they make
  // a new file respectively
  onFileClick: (name: string) => void,
  onFolderClick: (name: string) => void,
  onRename: (prev: string, next: string) => void,
  onNewFile: () => void
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
const FileRenderer: React.FC<RenderProps> = (props) => {
  const { files, onFileClick, onFolderClick, onRename, onNewFile } = props;
  const sorted = sortFiles(files);

  return (
    // Mapping over all files given from Dashboard, with a little bit
    // of inline styling to facilitate flex divs
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {sorted.map((file, index) => (
        <div key={file.filename + index} style={{ width: "24%" }}>
          {file.type === "folder" && (
            <FolderContainer
              filename={file.filename}
              onClick={() => onFolderClick(file.filename)}
              onRename={onRename} />
          )}
          {file.type === "file" && (
            <FileContainer
              filename={file.filename}
              image={Default}
              onClick={() => onFileClick(file.filename)}
              onRename={onRename} />
          )}
        </div>
      ))}
      <div style={{ width: "24%" }}>
        <FileContainer
          filename="New"
          image={NewPost}
          onClick={onNewFile} />
      </div>
    </div>
  )
}

export default FileRenderer;
