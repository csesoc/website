import React from 'react';
import { StyledButton, buttonProps } from './CreateContentBlock-Styled';
import { AiFillEdit } from "react-icons/ai";

type Props = {
  onClick?: (...args: any) => void;
} & buttonProps;

export default function CreateContentBlock({onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      <AiFillEdit/>
      Insert Content Block
    </StyledButton>
  );
}