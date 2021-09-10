// Basic container for dashboard folders
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// Wraps the contents of a folder stored on the CMS into its own
// functional component, can be clicked on to access subdirectories

import React, { useState } from "react";
import styled from 'styled-components';
import FolderIcon from '@material-ui/icons/Folder';

interface FolderProps {
  filename: string,
  onClick: () => void,
  onRename: (prev: string, next: string) => void
}

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  text-align: center;
`;

const FolderContainer: React.FC<FolderProps> = ({ filename, onClick, onRename }) => {
  const [toggle, setToggle] = useState(true);
  const [name, setName] = useState(filename);
  
  const orig_name = filename;

  return (
    <div>
      <IconContainer>
        <FolderIcon
          onClick={onClick}
          style={{
            color: "#999999",
            height: "100%",
            width: "100%"
          }} />
        {toggle ? (
          <p
            onDoubleClick={() => setToggle(false)}>
            {filename}
          </p>
        ) : (
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            onKeyDown={event => {
              if (event.key === "Enter" || event.key === "Escape") {
                if (event.key === "Enter") {
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

export default FolderContainer;
