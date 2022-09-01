import React, { MouseEventHandler } from "react";
import { StyledButton, buttonProps } from "./SyncContent-Styled";
import { FaSyncAlt } from "react-icons/fa";

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function SyncContent({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton onClick={onClick} {...styleProps}>
      <FaSyncAlt />
      Sync Content
    </StyledButton>
  );
}
