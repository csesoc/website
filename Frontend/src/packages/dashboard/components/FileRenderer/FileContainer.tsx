// Basic container for dashboard files
// Created by Hanyuan Li, @hanyuone (09/2021)
// # # #
// Wraps the contents of a file stored on the CMS into its own
// functional component, with hovering capabilities

import React from "react";
import styled, {css} from 'styled-components';
import Renamable from "./Renamable";

interface Props {
  name: string;
  id: number;
}

// Carry over styled component from FileRenderer.tsx
const IconContainer = styled.div`
  width: 50px;
  height: 100px;
  background: grey;
  
  display: flex;
  flex-direction: column;
  margin: 20px;
  text-align: center;
`;

interface HighlightProps {
  active: boolean
}

// Styled component for file when it's hovered over
const HoverImage = styled.img<HighlightProps>`
  border: 5px solid #999999;
  border-radius: 3px;
  
  ${props => props.active && css`
    border-color: lightblue;
  `}
`

function FileContainer({name, id}: Props) {
  return (
    <>
      <IconContainer>
      </IconContainer>
      <Renamable name={name} id={id} />
    </>
  )
}

export default FileContainer;
