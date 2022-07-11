// Basic container for dashboard folders
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// Wraps the contents of a folder stored on the CMS into its own
// functional component, can be clicked on to access subdirectories

import React from "react";
import styled, { css } from 'styled-components';
import FolderIcon from '@mui/icons-material/Folder';
import Renamable from "./Renamable";

interface FolderProps {
  filename: string,
  active: boolean,
  onClick: () => void,
  onDoubleClick: () => void,
  onRename: (newName: string) => void
}

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  text-align: center;
`;

interface HighlightProps {
  active: boolean
}

const Folder = styled(FolderIcon)<HighlightProps>`
  color: #999999;

  ${props => props.active && css`
    border: 5px solid lightblue;
    border-radius: 3px;
  `}
`

const FolderContainer: React.FC<FolderProps> = ({ filename, active, onClick, onDoubleClick, onRename }) => {
  return (
    <div>
      <IconContainer>
        <Folder
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          active={active}
          style={{
            height: "100%",
            width: "100%"
          }} />
        <Renamable
          name={filename}
          onRename={onRename} />
      </IconContainer>
    </div>
  );
};

export default FolderContainer;
