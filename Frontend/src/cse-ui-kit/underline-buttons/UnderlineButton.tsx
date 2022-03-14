import React from 'react';
import { StyledButton, buttonProps } from './UnderlineButton-Styled';


type Props = {
  children?: React.ReactElement | any;
  onClick?: (...args: any) => void;
} & buttonProps;

export default function UnderlineButton({ children, onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      {children}
    </StyledButton>
  );
}