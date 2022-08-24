import React, { MouseEventHandler } from "react";
import { StyledButton, buttonProps } from "./CreateMediaBlock-Styled";
import { AiFillPicture } from "react-icons/ai";

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function CreateMediaBlock({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      data-anchor="CreateMediaBlockButton"
      onClick={onClick}
      {...styleProps}
    >
      <AiFillPicture />
      Insert Media Block
    </StyledButton>
  );
}
