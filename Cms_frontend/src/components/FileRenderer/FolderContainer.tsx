// Basic container for dashboard folders
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// Wraps the contents of a folder stored on the CMS into its own
// functional component, can be clicked on to access subdirectories

import React from "react";
import styled from 'styled-components';
import FolderIcon from '@material-ui/icons/Folder';

interface FolderProps {
  filename: string,
  onClick: () => void
}

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  text-align: center;
`;

const FolderContainer: React.FC<FolderProps> = ({ filename, onClick }) => {
  return (
    <div onClick={onClick}>
      <IconContainer>
        <FolderIcon style={{
          color: "#999999",
          height: "307px",
          width: "100%"
        }} />
        {filename}
      </IconContainer>
    </div>
  );
};

export default FolderContainer;
