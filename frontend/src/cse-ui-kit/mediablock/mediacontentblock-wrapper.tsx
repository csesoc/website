/* eslint-disable */
import React from 'react';
import { StyledMediaContent, StyledMediaContentDots, StyledProps } from './mediacontentblock-Styled';
import { ReactComponent as Dots } from '../../assets/moveable-content-dots.svg';
import { Box } from "@mui/material";

type Props = {
  children?: React.ReactElement | any;
  onClick?: (...args: any) => void;
} & StyledProps;

export default function MoveableContentBlock({ children, onClick, ...styleProps }: Props) {
  const { focused } = styleProps;
  return (
    <StyledMediaContent
      onClick={onClick}
      {...styleProps}
      data-anchor="ContentBlockWrapper"
    >
      <div
        style={{
          width: "90%",
          wordWrap: "break-word"
        }}
      >
        {children}
      </div>
      <StyledMediaContentDots>
        { (focused == true) &&
          <Dots
            height="18px"
            width="18px"
          />
        }
      </StyledMediaContentDots>
    </StyledMediaContent>
  );
}