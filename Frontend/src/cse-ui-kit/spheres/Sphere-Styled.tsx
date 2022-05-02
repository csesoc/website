import styled from "styled-components";

export type sphereProps = {
  colourMain?: string;
  colourSecondary?: string;
  angle?: number;
  blur?: number;
}
export const StyledSphere = styled.div<sphereProps>`
  width: 100px;
  height: 100px;
  background: linear-gradient(${props => props.angle}deg, ${props => props.colourMain} -12%, ${props => props.colourSecondary} 76%);
  filter: blur(${props => props.blur}px);
  mix-blend-mode: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;