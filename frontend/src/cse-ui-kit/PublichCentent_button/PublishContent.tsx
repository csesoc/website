import React, { MouseEventHandler } from "react";
import { StyledButton, buttonProps } from "./PublishContent-Styled";
import { MdPublish } from "react-icons/md";

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function PublishContent({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton onClick={onClick} {...styleProps}>
      <MdPublish />
      Publish Content
    </StyledButton>
  );
}
