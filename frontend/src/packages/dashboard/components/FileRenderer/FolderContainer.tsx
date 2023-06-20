import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { traverseIntoFolder } from 'src/packages/dashboard/state/folders/actions';
import Renamable from './Renamable';
import FolderIcon from '@mui/icons-material/Folder';

interface Props {
  name: string;
  id: string;
  selectedFile: string | null;
  setSelectedFile: (id: string) => void;
  handleDeleteKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  text-align: center;
  cursor: pointer;
`;

interface HighlightProps {
  active: boolean;
}

const Folder = styled.div<HighlightProps>`
  width: 100px;
  height: 100px;
  background: #999999;

  ${(props) =>
    props.active &&
    `
    border: 5px solid lightblue;
    border-radius: 3px;
  `}
`;

export default function FolderContainer({
  name,
  id,
  selectedFile,
  setSelectedFile,
  handleDeleteKeyDown,
}: Props) {
  const dispatch = useDispatch();

  const handleClick = () => {
    console.log(id);
    setSelectedFile(id);
    if (fileEntityRef && fileEntityRef.current) {
      fileEntityRef.current.focus();
    }
  };

  const handleDoubleClick = () => {
    console.log(id);
    dispatch(traverseIntoFolder(id));
  };

  const fileEntityRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    setSelectedFile('');
  };

  return (
    <IconContainer>
      <div
        tabIndex={0}
        ref={fileEntityRef}
        onBlur={handleBlur}
        onKeyDown={handleDeleteKeyDown}
      >
        <FolderIcon
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          sx={{
            color: selectedFile == id ? '#f590a1' : '#e3e3e3',
            fontSize: '100px',
          }}
        />
      </div>

      {/* <Folder active={false} /> */}
      <Renamable name={name} id={id} />
    </IconContainer>
  );
}
