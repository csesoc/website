import React from 'react';
import styled from 'styled-components';
import FolderIcon from '@material-ui/icons/Folder';


interface Props {
  name: string
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

const Folder = styled(FolderIcon)<HighlightProps>`
  color: #999999;

  ${props => props.active && `
    border: 5px solid lightblue;
    border-radius: 3px;
  `}
`


export default function FolderContainer({ name }: Props) {
  return (
    <IconContainer>
      <Folder active={false} />
      {name}
    </IconContainer>
  )
}
