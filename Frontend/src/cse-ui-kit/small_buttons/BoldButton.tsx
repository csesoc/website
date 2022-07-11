import React, { MouseEventHandler } from 'react';
import { StyledButton, buttonProps, scaleRate } from './small_buttons-Styled';
import { ReactComponent as Bold } from 'src/cse-ui-kit/assets/bold-button.svg';

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function BoldButton({
  onClick,
  onMouseDown,
  ...styleProps
}: Props) {
  return (
    <StyledButton onClick={onClick} onMouseDown={onMouseDown} {...styleProps}>
      <Bold
        height={styleProps.size * scaleRate.smallButtonRate}
        width={styleProps.size * scaleRate.smallButtonRate}
      />
    </StyledButton>
  );
}
