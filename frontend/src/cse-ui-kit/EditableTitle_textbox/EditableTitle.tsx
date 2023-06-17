import React, { MouseEventHandler } from "react";
import { StyledTextBox, buttonProps } from "./EditableTitle-Styled";
import { AiFillEdit } from "react-icons/ai";

type Props = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  value: string
} & buttonProps;

export default function EditableTitle({ onChange, onBlur, value, ...styleProps }: Props) { 
  return (
    <StyledTextBox onChange={onChange} onBlur={onBlur} value={value} {...styleProps}/>
  );
}

