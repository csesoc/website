import styled from "styled-components";

export type sphereProps = {
  size?: number;
  colourMain?: string;
  colourSecondary?: string;
  startMainPoint?: number;
  startSecondaryPoint?: number;
  angle?: number;
  blur?: number;
  rotation?: number;
}

export const StyledSphere = styled.div<sphereProps>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
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