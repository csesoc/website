import React from 'react';
import { StyledButton, buttonProps } from './small_buttons-Styled';
import { ReactComponent as Italic } from '../../assets/italics-button.svg';


type Props = {
  onClick?: (...args: any) => void;
} & buttonProps;

export default function ItalicButton({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      <Italic height={parseInt(styleProps.size) * 0.8} width={parseInt(styleProps.size) * 0.8} />
    </StyledButton>
  );
}