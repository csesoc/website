import React from 'react';
import { StyledContainer, ImgContainer } from './ClearLayeredGlassContainer-Styled';
import Image from 'next/image';

export default function ClearLayeredGlass() {
  return (
    <div>
      <StyledContainer position="relative">
        <StyledContainer position="absolute" top={1} left={1} />
        <ImgContainer>
          <Image src="/assets/CSESocEventsCP.png" layout="fill" objectFit="contain" />
        </ImgContainer>
      </StyledContainer>
    </div>
  );
}
