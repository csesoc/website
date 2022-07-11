import React, { MouseEventHandler } from 'react';
import { StyledButton, buttonProps, scaleRate } from './small_buttons-Styled';
import { ReactComponent as Underline } from 'src/cse-ui-kit/assets/underline-button.svg';

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function UnderlineButton({
  onClick,
  onMouseDown,
  ...styleProps
}: Props) {
  return (
    <StyledButton onClick={onClick} onMouseDown={onMouseDown} {...styleProps}>
      <Underline
        height={styleProps.size * scaleRate.underlineRate}
        width={styleProps.size * scaleRate.underlineRate}
      />
    </StyledButton>
  );
}
