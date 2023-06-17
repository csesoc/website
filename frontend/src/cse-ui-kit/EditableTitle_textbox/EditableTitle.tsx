import React, { MouseEventHandler } from "react";
import { StyledTextBox, buttonProps } from "./EditableTitle-Styled";
import { AiFillEdit } from "react-icons/ai";

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  value: string
} & buttonProps;

export default function EditableTitle({ onClick, value, ...styleProps }: Props) {
  return (
    <StyledTextBox onClick={onClick} value={value} {...styleProps}/>
  );
}

