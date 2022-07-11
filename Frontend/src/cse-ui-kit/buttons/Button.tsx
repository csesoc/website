import React from 'react';
import { StyledButton, buttonProps } from './Button-Styled';


type Props = {
  children?: React.ReactElement | any;
  onClick?: (...args: any) => void;
} & buttonProps;

export default function Button({ children, onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      {children}
    </StyledButton>
  );
}
