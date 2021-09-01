// Basic container for dashboard files
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// Wraps the contents of a file stored on the CMS into its own
// functional component, with hovering capabilities

import React from "react";
import styled from 'styled-components';

interface FileProps {
  filename: string,
  onClick: () => void,
  image: string
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

const FileContainer: React.FC<FileProps> = ({ filename, onClick, image }) => {
  return (
    <div onClick={onClick}>
      <IconContainer>
        <HoverImage src={image} />
        {filename}
      </IconContainer>
    </div>
  );
};

export default FileContainer;
