import React from 'react';
import { StyledButton, buttonProps, scaleRate } from './small_buttons-Styled';
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
      <Underline
        height={styleProps.size * scaleRate.underlineRate}
        width={styleProps.size * scaleRate.underlineRate}
      />
    </StyledButton>
  );
}