// Basic container for dashboard files
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// Wraps the contents of a file stored on the CMS into its own
// functional component, with hovering capabilities

import React, { useState } from "react";
import styled from 'styled-components';

interface FileProps {
  filename: string,
  image: string,
  onClick: () => void,
  onRename?: (prev: string, next: string) => void
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
  const [toggle, setToggle] = useState(true);
  const [name, setName] = useState(filename);
  const orig_name = filename;

  return (
    <div onClick={onClick}>
      <IconContainer>
        <HoverImage src={image} />
        {toggle ? (
          <p
            onDoubleClick={() => {
              if (onRename !== undefined) {
                setToggle(false);
              }
            }}>
            {filename}
          </p>
        ) : (
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            onKeyDown={event => {
              if (event.key === "Enter" || event.key === "Escape") {
                if (event.key === "Enter" && onRename !== undefined) {
                  onRename(orig_name, name);
                }

                setToggle(true);
                event.preventDefault();
                event.stopPropagation();
              }
            }} />
        )}
      </IconContainer>
    </div>
  );
};

export default FileContainer;
