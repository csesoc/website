import React from 'react';
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
}

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  text-align: center;
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
}: Props) {
  const dispatch = useDispatch();

  const handleClick = () => {
    setSelectedFile(id);
  };

  const handleDoubleClick = () => {
    dispatch(traverseIntoFolder(id));
  };
  return (
    <IconContainer>
      <FolderIcon
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        sx={{
          color: '#e3e3e3',
          fontSize: '100px',
        }}
      />
      {/* <Folder active={false}/> */}
      <Renamable name={name} id={id} />
    </IconContainer>
  );
}
