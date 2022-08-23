import React, { MouseEventHandler } from "react";
import { StyledContent, buttonProps, Text} from "./MediaContent-Styled";
import { ReactComponent as Media } from 'src/cse-ui-kit/assets/media-icon.svg';
import MoveableContentBlock from '../contentblock/contentblock-wrapper';

type Props = {
  onClick?: MouseEventHandler<HTMLDivElement>;
} & buttonProps;

export default function MediaContentBlock({ onClick, ...styleProps }: Props) {
  return (
    <MoveableContentBlock onClick={onClick} {...styleProps}>
      <StyledContent>
        <Media        
          height={100}
          width={100}/>
        <Text>Upload Images/Gifs</Text>
        </StyledContent>
    </MoveableContentBlock>
  );
}