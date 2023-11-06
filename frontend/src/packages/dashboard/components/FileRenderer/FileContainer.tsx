// Basic container for dashboard files
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// Wraps the contents of a file stored on the CMS into its own
// functional component, with hovering capabilities

import React from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Renamable from './Renamable';

type Props = {
  name: string;
  id: string;
  selectedFile: string | null;
  setSelectedFile: (id: string) => void;
};

type styledProps = {
  active: boolean;
};

// Carry over styled component from FileRenderer.tsx
const IconContainer = styled.div<styledProps>`
  --background-color: grey;
  width: 55px;
  height: 75px;
  background: var(--background-color);

  display: flex;
  flex-direction: column;
  text-align: center;
  margin-bottom: 10px;
  cursor: pointer;
  margin: 20px;

  border: ${(props) =>
    props.active ? '3px solid red' : '3px solid var(--background-color)'};
`;

function FileContainer({ name, id, selectedFile, setSelectedFile }: Props) {
  const handleClick = () => {
    console.log(id);
    setSelectedFile(id);
  };

  const navigate = useNavigate();
  const handleDoubleClick = () => {
    console.log(id);
    setSelectedFile(id);
    if (selectedFile !== null) {
      navigate('/editor/' + selectedFile, {
        replace: false,
        state: {
          filename: name,
        },
      }),
        [navigate];
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '140px',
      }}
    >
      <IconContainer
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        active={selectedFile == id}
      />
      <Renamable name={name} id={id} />
    </div>
  );
}

export default FileContainer;
