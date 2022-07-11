import styled from "styled-components";

export type buttonProps = {
  background?: string;
};
export const StyledButton = styled.div<buttonProps>`
  width: 175px;
  height: 45px;
  margin: 5px;
  background: ${(props) => props.background};

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  user-select: none;

  &:hover {
    background: #efeef3;
    color: black;
    transform: scale(1.04);
  }
  &:active {
    background: #c8d1fa;
    transform: scale(0.96);
  }

  cursor: pointer;
`;
