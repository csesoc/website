import React  from "react";
import { StyledTextBox } from "./EditableTitle-Styled";

type Props = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  value: string
};

export default function EditableTitle({ onChange, onBlur, value, ...styleProps }: Props) { 
  return (
    <StyledTextBox onChange={onChange} onBlur={onBlur} value={value} {...styleProps}/>
  );
}

