import React from 'react';
import { StyledButton, buttonProps, scaleRate } from './text-alignment-Styled';
import { ReactComponent as MiddleAlign } from
  'src/cse-ui-kit/assets/middlealign-button.svg';

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
        height={styleProps.size * scaleRate}
        width={styleProps.size * scaleRate}
      />
    </StyledButton>
  );
}