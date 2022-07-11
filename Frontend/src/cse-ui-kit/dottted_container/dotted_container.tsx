import React from 'react';
import { StyledContainer, containerProps } from './dotted_container-Styled';


type Props = {
  children?: React.ReactElement | any;
  className?: string;
} & containerProps;

export default function DottedContainer({ children, className}: Props) {
  return (
      <StyledContainer className={className}>
        {children}
      </StyledContainer>    
  );
}
