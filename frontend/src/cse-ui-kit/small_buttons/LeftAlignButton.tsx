import React, { MouseEventHandler } from 'react';
import { StyledButton, buttonProps, scaleRate } from './small_buttons-Styled';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseDown?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function LeftAlignButton({
  onClick,
  onMouseDown,
  ...styleProps
}: Props) {
  return (
    <StyledButton onClick={onClick} onMouseDown={onMouseDown} {...styleProps}>
      <AlignHorizontalLeftIcon
        height={styleProps.size * scaleRate.smallButtonRate}
        width={styleProps.size * scaleRate.smallButtonRate}
      />
    </StyledButton>
  );
}
