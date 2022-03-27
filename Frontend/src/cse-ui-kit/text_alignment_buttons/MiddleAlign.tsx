import React from 'react';
import { StyledButton, buttonProps } from './middle-alignment-Styled';
import { ReactComponent as MiddleAlign } from '../../assets/middlealign-button.svg';

type Props = {
  onClick?: (...args: any) => void;
} & buttonProps;

export default function MiddleAlignButton({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      <MiddleAlign height={parseInt(styleProps.size) * 0.65} width={parseInt(styleProps.size) * 0.65} />
    </StyledButton>
  );
}