import React from 'react';
import { StyledButton, buttonProps } from './CreateContentBlock-Styled';
import { AiFillEdit } from "react-icons/ai";

type Props = {
  children?: React.ReactElement | any;
  onClick?: (...args: any) => void;
} & buttonProps;

export default function CreateContentBlock({ children, onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      {children}
    </StyledButton>
  );
}