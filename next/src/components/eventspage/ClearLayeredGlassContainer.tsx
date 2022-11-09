import React from 'react';
import { GlassContainer, ImgContainer } from './ClearLayeredGlassContainer-Styled';
import Image from 'next/image';

export default function ClearLayeredGlass() {
  return (
    <div>
      <GlassContainer position="relative">
        <GlassContainer position="absolute" top={1} left={1} />
        <ImgContainer>
          <Image src="/assets/CSESocEventsCP.png" layout="fill" objectFit="contain" />
        </ImgContainer>
      </GlassContainer>
    </div>
  );
}
