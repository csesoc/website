import styled from "styled-components";

export type buttonProps = {
  background?: string;
}
export const StyledButton = styled.div<buttonProps>`
  width: 80px;
  height: 45px;
  background: ${props => props.background };
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;

  &:hover {
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }

  cursor: pointer;
`;