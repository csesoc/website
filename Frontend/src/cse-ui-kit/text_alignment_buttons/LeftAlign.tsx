import React from 'react';
import { StyledButton, buttonProps, scaleRate } from './text-alignment-Styled';
import { ReactComponent as LeftAlign } from '../../assets/leftalign-button.svg';

type Props = {
  onClick?: (...args: any) => void;
} & buttonProps;

export default function LeftAlignButton({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      <LeftAlign
        height={styleProps.size * scaleRate}
        width={styleProps.size * scaleRate}
      />
    </StyledButton>
  );
}