import React, { MouseEventHandler } from "react";
import { StyledButton, buttonProps } from "./CreateHeadingBlock-Styled";
import { AiFillEdit } from "react-icons/ai";

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function CreateHeadingBlock({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton onClick={onClick} {...styleProps}>
      <AiFillEdit />
      Insert Heading Block
    </StyledButton>
  );
}
