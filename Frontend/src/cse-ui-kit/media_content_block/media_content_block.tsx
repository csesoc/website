import React, { MouseEventHandler } from "react";
import { StyledButton, buttonProps, scaleRate } from "./media_content-Styled";
import { ReactComponent as Media } from 'src/cse-ui-kit/assets/media-icon.svg';
import { ReactComponent as Dots } from '../../assets/moveable-content-dots.svg';

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function MediaContentBlock({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton onClick={onClick} {...styleProps}>
      <Media        
        height={60}
        width={60}/>
      Upload Images/Gifs
      <Dots
          height="18px"
          width="18px"
        />
    </StyledButton>
  );
}