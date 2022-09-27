import React, { MouseEventHandler } from "react";
import { StyledButton, buttonProps } from "./SyncDocument-Styled";
import { AiOutlineSync } from "react-icons/ai";

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function SyncDocument({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton onClick={onClick} {...styleProps}>
      <AiOutlineSync />
      Sync Document
    </StyledButton>
  );
}
