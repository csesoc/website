import React from 'react';
import { StyledButton, buttonProps, scaleRate } from './small_buttons-Styled';
import { ReactComponent as Italic } from 'src/cse-ui-kit/assets/italics-button.svg';


type Props = {
  onClick?: (...args: any) => void;
} & buttonProps;

export default function ItalicButton({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton
      onClick={onClick}
      {...styleProps}
    >
      <Italic
        height={styleProps.size * scaleRate.smallButtonRate}
        width={styleProps.size * scaleRate.smallButtonRate}
      />
    </StyledButton>
  );
}