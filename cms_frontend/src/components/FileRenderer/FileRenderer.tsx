import React from 'react';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FolderIcon from '@material-ui/icons/Folder';
import styled from 'styled-components';

// type declaration for props
interface FileProps {
  filename: string,
  type: string
}

// style declaration using styled components
// must be capitalised
const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`

// Typescript Declaration
// uses the interface defined above
// imports the icons from material UI
const FileRenderer: React.FC<FileProps> = ({ filename, type }) => {
  return (
    <>
    {type === "folder" && (
      <IconContainer>
        <FolderIcon/>
        {filename}
      </IconContainer>
    )}
    {type === "file" && (
      <IconContainer>
        <InsertDriveFileIcon/>
        {filename}
      </IconContainer>
    )}
    </>
  )
}

export default FileRenderer
