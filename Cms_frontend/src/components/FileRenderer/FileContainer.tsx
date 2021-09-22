// Basic container for dashboard files
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// Wraps the contents of a file stored on the CMS into its own
// functional component, with hovering capabilities

import React from "react";
import styled from 'styled-components';
import Renamable from "./Renamable";

interface FileProps {
  filename: string,
  image: string,
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

// Styled component for file when it's hovered over
const HoverImage = styled.img`
  border: 5px solid #999999;
  border-radius: 3px;
  transition: 0.3s ease-out;

  &:hover {
    border-color: lightblue;
    transition: 0.3s ease-out;
  }
`

const FileContainer: React.FC<FileProps> = ({ filename, image, onClick, onRename }) => {
  return (
    <div>
      <IconContainer>
        <HoverImage
          src={image}
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
