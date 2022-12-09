import React, { MouseEventHandler } from 'react';
import { StyledButton, buttonProps, scaleRate } from './small_buttons-Styled';
import { ReactComponent as CenterAlign } from 'src/cse-ui-kit/assets/centeralign-button.svg';

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function CenterAlignButton({
  onClick,
  onMouseDown,
  ...styleProps
}: Props) {
  return (
    <StyledButton onClick={onClick} onMouseDown={onMouseDown} {...styleProps}>
      <CenterAlign
        height={styleProps.size * scaleRate}
        width={styleProps.size * scaleRate}
      />
    </StyledButton>
  );
}
