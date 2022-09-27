import React, { MouseEventHandler } from "react";
import { StyledButton, buttonProps } from "./PublishDocument-Styled";
import { MdPublish } from "react-icons/md";

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function PublishDocument({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton onClick={onClick} {...styleProps}>
      <MdPublish />
      Publish Document
    </StyledButton>
  );
}
