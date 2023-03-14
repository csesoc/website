import styled from "styled-components";

export type buttonProps = {
  background?: string;
  isFocused?: boolean
};
export const StyledButton = styled.div<buttonProps>`
  width: 45px;
  height: 45px;
  margin: 5px;
  background: ${(props) => props.background};

  display: ${(props) => props.isFocused ? "flex" : "none"};
  justify-content: center;
  align-items: center;
  border-radius: 30px;
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
