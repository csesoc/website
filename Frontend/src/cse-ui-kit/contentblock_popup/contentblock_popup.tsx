import React from 'react';
import { StyledContainer, StyledContent, MainText, BoldText } from './contentblock_popup-Styled';

type Props = {
  children?: React.ReactElement | any;
  onClick?: (...args: any) => void;
};

export default function ContentBlockPopup({ children, onClick, ...styleProps }: Props) {
  return (
    <StyledContainer
      onClick={onClick}
      {...styleProps}
    >
      <StyledContent>
        <MainText>
          <BoldText>Drag and Drop</BoldText> or <BoldText>click here</BoldText>
        </MainText>
        <MainText>
          to upload your image
        </MainText>
      </StyledContent>
    </StyledContainer>
  )
}