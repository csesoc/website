import styled from "styled-components";
import { device } from "../../styles/device";

export type sphereProps = {
  left?: number;
  top?: number;
  leftMobile?: number;
  topMobile?: number;
  size?: number;
  sizeMobile?: number;
  colourMain?: string;
  colourSecondary?: string;
  startMainPoint?: number;
  startSecondaryPoint?: number;
  angle?: number;
  blur?: number;
  rotation?: number;
}

export const StyledSphere = styled.div<sphereProps>`
  position: absolute;
  z-index: 0;
  left: ${props => props.leftMobile}%;
  top: ${props => props.topMobile}%;
  width: ${props => props.sizeMobile}vw;
  height: ${props => props.sizeMobile}vw;
  background: linear-gradient(
    ${props => props.angle}deg, 
    ${props => props.colourMain} ${props => props.startMainPoint}%, 
    ${props => props.colourSecondary} ${props => props.startSecondaryPoint}%
  );
  filter: blur(${props => props.blur}px);
  transform: rotate(${props => props.rotation}deg);
  mix-blend-mode: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;

  max-width: 400px;
  max-height: 400px;
  @media ${device.tablet} {
    left: ${props => props.left}%;
    top: ${props => props.top}%;
    width: ${props => props.size}vw;
    height: ${props => props.size}vw;
  }
`;

// The default main colour (#969DC7) represents violet whilst the default
// secondary colour (#E8CAFF) represents pink
StyledSphere.defaultProps = {
  size: 100,
  colourMain: "#9B9BE1",
  colourSecondary: "#E8CAFF",
  startMainPoint: 0,
  startSecondaryPoint: 100,
  angle: 0,
  blur: 0,
  rotation: 0,
}