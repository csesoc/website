import React, { MouseEventHandler } from "react";
import { StyledButton, buttonProps } from "./CreateTitleBlock-Styled";
import { AiFillEdit } from "react-icons/ai";

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function CreateTitleBlock({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton onClick={onClick} {...styleProps}>
      <AiFillEdit />
      Insert Title Block
    </StyledButton>
  );
}
