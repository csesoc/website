import React, { MouseEventHandler } from 'react';
import { StyledButton, buttonProps, scaleRate } from './small_buttons-Styled';
import { ReactComponent as Italic } from 'src/cse-ui-kit/assets/italics-button.svg';


type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function ItalicButton({
  onClick,
  onMouseDown,
  ...styleProps
}: Props) {
  return (
    <StyledButton onClick={onClick} onMouseDown={onMouseDown} {...styleProps}>
      <Italic
        height={styleProps.size * scaleRate.smallButtonRate}
        width={styleProps.size * scaleRate.smallButtonRate}
      />
    </StyledButton>
  );
}
