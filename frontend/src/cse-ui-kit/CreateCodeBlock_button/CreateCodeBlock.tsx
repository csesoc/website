import React, { MouseEventHandler } from "react";
import { StyledButton, buttonProps } from "./CreateCodeBlock-Styled";
import { AiFillEdit } from "react-icons/ai";

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function CreateCodeBlock({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      data-anchor="CreateCodeBlockButton"
      onClick={onClick}
      {...styleProps}
    >
      <AiFillEdit />
      Insert Code Block
    </StyledButton>
  );
}
