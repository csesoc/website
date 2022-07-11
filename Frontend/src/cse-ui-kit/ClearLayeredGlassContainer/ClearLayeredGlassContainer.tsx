import React from 'react';
import { StyledContainer } from './ClearLayeredGlassContainer-Styled';

// The colour listed first below (#71c0f882) represents blue whilst the
// second colour (#f8717182) represents red
export default function ClearLayeredGlass() {
  return (
    <div>
      <StyledContainer position="relative" colour="#71c0f882" />
      <StyledContainer position="absolute" top={2} left={2} colour="#f8717182" />
    </div>
  );
}
