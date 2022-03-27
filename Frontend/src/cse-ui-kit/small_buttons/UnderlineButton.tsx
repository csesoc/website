import React from 'react';
import { StyledButton, buttonProps } from './small_buttons-Styled';
import { ReactComponent as Underline } from '../../assets/underline-button.svg';

type Props = {
  onClick?: (...args: any) => void;
} & buttonProps;

export default function UnderlineButton({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      <Underline height={parseInt(styleProps.size) * 0.6} width={parseInt(styleProps.size) * 0.6} />
    </StyledButton>
  );
}