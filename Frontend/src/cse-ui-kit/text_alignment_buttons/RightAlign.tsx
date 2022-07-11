import React from 'react';
import { StyledButton, buttonProps, scaleRate } from './text-alignment-Styled';
import { ReactComponent as RightAlign } from
  'src/cse-ui-kit/assets/rightalign-button.svg';

type Props = {
  onClick?: (...args: any) => void;
} & buttonProps;

export default function RightAlignButton({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      <RightAlign
        height={styleProps.size * scaleRate}
        width={styleProps.size * scaleRate}
      />
    </StyledButton>
  );
}