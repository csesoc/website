import React from 'react';
import { StyledButton, buttonProps, scaleRate } from './text-alignment-Styled';
import { ReactComponent as MiddleAlign } from
  '../../assets/middlealign-button.svg';

type Props = {
  onClick?: (...args: any) => void;
} & buttonProps;

export default function MiddleAlignButton({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      <MiddleAlign
        height={styleProps.size * scaleRate.textAlignmentRate}
        width={styleProps.size * scaleRate.textAlignmentRate}
      />
    </StyledButton>
  );
}