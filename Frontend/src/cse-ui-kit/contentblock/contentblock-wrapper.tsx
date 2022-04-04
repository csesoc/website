import React from 'react';
import { StyledContent, StyledContentText } from './contentblock-Styled';
import { ReactComponent as Dots } from '../../assets/moveable-content-dots.svg';

type Props = {
  children?: React.ReactElement | any;
  onClick?: (...args: any) => void;
};

export default function MoveableContentBlock({ children, onClick, ...styleProps }: Props) {
  return (
    <StyledContent
      onClick={onClick}
      {...styleProps}
    >
      <StyledContentText>
        {children}
      </StyledContentText>
      <Dots
        height="18px"
        width="18px"
      />
    </StyledContent>
  );
}