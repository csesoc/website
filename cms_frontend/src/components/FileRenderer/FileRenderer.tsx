import React from 'react';

import FolderContainer from "./FolderContainer";
import FileContainer from "./FileContainer";

import Default from "src/images/default.png";

// type declaration for props
interface RenderProps {
  filename: string,
  type: string,
  // Functions for when user clicks on a file/folder
  onFileClick: () => void,
  onFolderClick: () => void
}

// Typescript Declaration
// uses the interface defined above
// imports the icons from material UI
const FileRenderer: React.FC<RenderProps> = ({ filename, type, onFileClick, onFolderClick }) => {
  return (
    <div>
      {type === "folder" && (
        <FolderContainer filename={filename} onClick={onFolderClick} />
      )}
      {type === "file" && (
        <FileContainer filename={filename} onClick={onFileClick} image={Default} />
      )}
    </div>
  )
}

export default FileRenderer;
