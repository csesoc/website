/* eslint-disable */
import React from 'react';

import {
  StyledContainer,
  StyledDottedContainer,
  StyledContent,
  MainText,
  BoldText
} from './contentblock_popup-Styled';
import { ReactComponent as ContentUpload } from 'src/cse-ui-kit/assets/upload-content.svg';

type Props = {
  children?: React.ReactElement | any;
};

export default function ContentBlockPopup({ children }: Props) {
  return (
    <StyledContainer>
      <StyledDottedContainer>
        <StyledContent>
          <ContentUpload
            width="10vw"
            height="10vw"
            fill="#808080"
          />
          <MainText>
            <BoldText>
              Drag and Drop
            </BoldText> or <BoldText>
              click here
            </BoldText>
          </MainText>
          <MainText>
            to upload your image
          </MainText>
          {children}
        </StyledContent>
      </StyledDottedContainer>
    </StyledContainer>
  )
}