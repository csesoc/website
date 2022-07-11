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
    background: #EFEEF3;
    color: black;
    transform: scale(1.04);
  }
  &:active {
    background: #C8D1FA;
    color: #7482CB;
    transform: scale(0.96);
  }

  cursor: pointer;
`;