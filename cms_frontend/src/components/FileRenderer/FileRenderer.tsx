import React from 'react';

import FolderContainer from "./FolderContainer";
import FileContainer from "./FileContainer";

import Default from "src/images/default.png";
import NewPost from "src/images/new_post.png";

interface FileFormat {
  filename: string,
  type: string
}

// type declaration for props
interface RenderProps {
  files: FileFormat[],
  // Functions for user interactions - when they click on an
  // existing file, when they click on a folder, and when they make
  // a new file respectively
  onFileClick: (name: string) => void,
  onFolderClick: (name: string) => void,
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
const FileRenderer: React.FC<RenderProps> = ({ files, onFileClick, onFolderClick, onNewFile }) => {
  const sorted = sortFiles(files);

  return (
    // Mapping over all files given from Dashboard, with a little bit
    // of inline styling to facilitate flex divs
    <div style={{ display: "flex" }}>
      {sorted.map((file, index) => {
        return (
          <div key={index} style={{ flexBasis: "25%" }}>
            {file.type === "folder" && (
              <FolderContainer
                filename={file.filename}
                onClick={() => onFolderClick(file.filename)} />
            )}
            {file.type === "file" && (
              <FileContainer
                filename={file.filename}
                image={Default}
                onClick={() => onFileClick(file.filename)} />
            )}
          </div>
        );
      })}
      <div style={{ flexBasis: "25%" }}>
        <FileContainer
          filename="New"
          onClick={onNewFile}
          image={NewPost} />
      </div>
    </div>
  )
}

export default FileRenderer;
