// Basic container for dashboard files
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// Wraps the contents of a file stored on the CMS into its own
// functional component, with hovering capabilities

import React from "react";
import styled, {css} from 'styled-components';
import Renamable from "./Renamable";

interface FileProps {
  filename: string,
  image: string,
  active: boolean,
  onClick: () => void,
  onRename?: (newName: string) => void
}

// Carry over styled component from FileRenderer.tsx
const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  text-align: center;
`;

interface HighlightProps {
  active: boolean
}

// Styled component for file when it's hovered over
const HoverImage = styled.img<HighlightProps>`
  border: 5px solid #999999;
  border-radius: 3px;
  
  ${props => props.active && css`
    border-color: lightblue;
  `}
`

const FileContainer: React.FC<FileProps> = ({ filename, image, active, onClick, onRename }) => {
  return (
    <div>
      <IconContainer>
        <HoverImage
          src={image}
          active={active}
          onClick={onClick} />
        {onRename === undefined ? (
          <p>{filename}</p>
        ) : (
          <Renamable
            name={filename}
            onRename={onRename} />
        )}
      </IconContainer>
    </div>
  );
};

export default FileContainer;
