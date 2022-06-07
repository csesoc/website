import styled from "styled-components";

export const scaleRate = {
    smallButtonRate: 0.2,
    underlineRate: 0.6,
  };

export type buttonProps = {
  background?: string;
};
export const StyledButton = styled.div<buttonProps>`
  width: 300px;
  height: 130px;
  margin: 5px;
  background: ${(props) => props.background};

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
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