import React, { MouseEventHandler } from "react";
import { StyledButton, buttonProps } from "./DeleteBlock-Styled";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function DeleteBlock({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      data-anchor="DeleteBlockButton"
      onClick={onClick}
      {...styleProps}
    >
      <AiOutlineClose />
    </StyledButton>
  );
}
