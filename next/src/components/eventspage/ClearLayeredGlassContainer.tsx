import React from 'react';
import { GlassContainer, ImgContainer } from './ClearLayeredGlassContainer-Styled';
import Image from 'next/image';

export default function ClearLayeredGlass() {
  return (
    <div>
      <GlassContainer position="relative">
        <GlassContainer position="relative" top={1} left={1} >
          <Image alt="Events" src="/assets/CSESocEventsCP.png" layout="fill" objectFit="contain" />
        </GlassContainer>
      </GlassContainer>
    </div>
  );
}
