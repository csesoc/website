import React from 'react';
import { StyledContainer, ImgContainer } from './EventsContainer-Styled';
import EventsImg from './EventsImg';

export default function EventsContainer() {
  return (
    <div>
      <StyledContainer position="relative">
        <StyledContainer position="absolute" top={1} left={1} />
        <ImgContainer>
          <EventsImg/>
        </ImgContainer>
      </StyledContainer>
    </div>
  );
}
