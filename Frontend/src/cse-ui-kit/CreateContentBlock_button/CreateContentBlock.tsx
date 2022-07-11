import React, { MouseEventHandler } from "react";
import { StyledButton, buttonProps } from "./CreateContentBlock-Styled";
import { AiFillEdit } from "react-icons/ai";

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function CreateContentBlock({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      data-anchor="CreateContentBlockButton"
      onClick={onClick}
      {...styleProps}
    >
      <AiFillEdit />
      Insert Content Block
    </StyledButton>
  );
}
