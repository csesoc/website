import React from 'react';
import { StyledContainer, containerProps } from './container-Styled';


type Props = {
  className?: string;
} & containerProps;

export default function Container({ className}: Props) {
  return (
    <div className={className}>
      <header>
          <StyledContainer></StyledContainer>
      </header>      
    </div>
  );
}
