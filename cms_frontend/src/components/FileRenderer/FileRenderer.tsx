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
  // Functions for when user clicks on a file/folder
  onFileClick: (name: string) => void,
  onFolderClick: (name: string) => void,
  onNewFile: () => void
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
};

// Typescript Declaration
// uses the interface defined above
// imports the icons from material UI
const FileRenderer: React.FC<RenderProps> = ({ files, onFileClick, onFolderClick, onNewFile }) => {
  const sorted = sortFiles(files);

  return (
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
