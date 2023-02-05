import React from 'react';
import { GlassContainer, ImgContainer } from './ClearLayeredGlassContainer-Styled';
import Image from 'next/image';

export default function ClearLayeredGlass() {
  return (
    <div>
      <GlassContainer position="relative">
        <GlassContainer position="relative" top={1} left={1} >
          <Image onClick={() => { window.open("https://www.facebook.com/events/507207411493903", '_blank') }} alt="Events" src="/assets/Oweek.png" layout="fill" objectFit="contain" />
        </GlassContainer>
      </GlassContainer>
    </div>
  );
}
