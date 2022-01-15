import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { traverseIntoFolder } from "src/packages/dashboard/state/folders/actions";
// import FolderIcon from '@material-ui/icons/Folder';


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
    dispatch(traverseIntoFolder(id))
  }

  return (
    <div onClick={handleClick}>
      <IconContainer >
        <Folder active={false} />
        {name}
      </IconContainer>
    </div>
  )
}
