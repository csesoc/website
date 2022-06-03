import React from 'react';
import { StyledContainer, ImgContainer } from './EventsContainer-Styled';
import Image from 'next/image';

export default function EventsContainer() {
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
