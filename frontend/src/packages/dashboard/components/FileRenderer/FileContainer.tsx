// Basic container for dashboard files
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// Wraps the contents of a file stored on the CMS into its own
// functional component, with hovering capabilities

import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Renamable from './Renamable';
import { useDispatch } from 'react-redux';

type Props = {
  name: string;
  id: string;
  selectedFile: string | null;
  setSelectedFile: (id: string) => void;
  handleDeleteKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
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

  border: ${(props) =>
    props.active ? '3px solid red' : '3px solid var(--background-color)'};
`;

function FileContainer({
  name,
  id,
  selectedFile,
  setSelectedFile,
  handleDeleteKeyDown,
}: Props) {
  const handleClick = () => {
    console.log(id);
    setSelectedFile(id);
    if (fileEntityRef && fileEntityRef.current) {
      fileEntityRef.current.focus();
    }
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

  const fileEntityRef = useRef<HTMLDivElement>(null);

  const handleBlur = () => {
    setSelectedFile('');
  };

  const dispatch = useDispatch();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '35px',
      }}
      tabIndex={0}
      ref={fileEntityRef}
      onBlur={handleBlur}
      onKeyDown={handleDeleteKeyDown}
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
