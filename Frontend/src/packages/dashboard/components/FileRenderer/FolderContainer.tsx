import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { traverseIntoFolder } from "src/packages/dashboard/state/folders/actions";
import Renamable from './Renamable';
import FolderIcon from '@mui/icons-material/Folder';


interface Props {
  name: string;
  id: number;
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

const Folder = styled.div<HighlightProps>`
  width: 100px;
  height: 100px;
  background: #999999;

  ${props => props.active && `
    border: 5px solid lightblue;
    border-radius: 3px;
  `}
`



export default function FolderContainer({ name, id }: Props) {
  const dispatch = useDispatch();
  const handleClick = () => {
    console.log(id);
    dispatch(traverseIntoFolder(id))
  }

  return (
    <IconContainer >
      <FolderIcon
        onClick={handleClick}
        sx={{
          color: "#e3e3e3",
          fontSize: "100px",
        }}
      />
      {/* <Folder active={false}/> */}
      <Renamable name={name} id={id} />
    </IconContainer>
  )
}
