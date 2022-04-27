import styled from "styled-components";

export type sphereProps = {
    background?: string;
}
export const StyledSphere = styled.div<sphereProps>`
  width: 100px;
  height: 100px;
  background-color: ${props => props.background};

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;