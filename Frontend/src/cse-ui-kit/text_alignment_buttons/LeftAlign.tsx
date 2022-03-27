import React from 'react';
import { StyledButton, buttonProps } from './left-right-alignment-Styled';
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
      <LeftAlign height={parseInt(styleProps.size) * 0.65} width={parseInt(styleProps.size) * 0.65} />
    </StyledButton>
  );
}