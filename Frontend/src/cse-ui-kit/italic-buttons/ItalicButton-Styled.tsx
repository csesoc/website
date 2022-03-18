import styled from "styled-components";

export type buttonProps = {
  background?: string;
  size: string;
}
export const StyledButton = styled.div<buttonProps>`
  height: ${props => props.size };
  width: ${props => props.size };
  background: ${props => props.background };
  color: #000000;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;

  &:hover {
    background: #EFEEF3;
    transform: scale(1.04);
  }
  &:active {
    background: #B7C3FF;
    transform: scale(0.96);
  }

  cursor: pointer;
`;