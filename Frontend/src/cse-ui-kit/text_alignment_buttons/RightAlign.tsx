import React from 'react';
import { StyledButton, buttonProps } from './left-right-alignment-Styled';
import { ReactComponent as RightAlign } from '../../assets/rightalign-button.svg';

type Props = {
  onClick?: (...args: any) => void;
} & buttonProps;

export default function RightAlignButton({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      <RightAlign height={parseInt(styleProps.size) * 0.65} width={parseInt(styleProps.size) * 0.65} />
    </StyledButton>
  );
}