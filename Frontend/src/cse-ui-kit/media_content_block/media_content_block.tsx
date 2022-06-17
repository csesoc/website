import React, { MouseEventHandler } from "react";
import { StyledButton, buttonProps, scaleRate, Text } from "./media_content-Styled";
import { ReactComponent as Media } from 'src/cse-ui-kit/assets/media-icon.svg';
import { ReactComponent as Dots } from '../../assets/moveable-content-dots.svg';

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function MediaContentBlock({ onClick, ...styleProps }: Props) {
  return (
    <StyledButton onClick={onClick} {...styleProps}>
      <Media        
        height={100}
        width={100}/>
      <Text>Upload Images/Gifs</Text>
      <Dots
          height="18px"
          width="18px"
        />
    </StyledButton>
  );
}