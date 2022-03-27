import React from 'react';
import { StyledButton, buttonProps } from './small_buttons-Styled';
import { ReactComponent as Bold } from '../../assets/bold-button.svg';

type Props = {
  onClick?: (...args: any) => void;
} & buttonProps;

export default function BoldButton({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      <Bold height={parseInt(styleProps.size) * 0.8} width={parseInt(styleProps.size) * 0.8} />
    </StyledButton>
  );
}