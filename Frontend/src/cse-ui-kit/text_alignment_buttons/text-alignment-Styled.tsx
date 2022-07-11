import styled from "styled-components";

export const scaleRate = 0.65;

export type buttonProps = {
  variant?: string;
  size: number;
}
export const StyledButton = styled.div<buttonProps>`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  background: ${props =>
    props.variant == "middle" ? "#2B3648" : "#FFFFFF"};
  color: ${props => props.variant == "middle" ? "#FFFFFF" : "#2B3648"};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${props => props.size / 10}px;

  &:hover { /*if middle: else left/right variant */
    background: ${props =>
    props.variant == "middle" ? "#5B687D" : "#EFEEF3"};
    color: ${props => props.variant == "middle" ? "#FFFFFF" : "#2B3648"};
    transform: scale(1.04);
  }
  &:active {
    background: #C8D1FA;
    color: #7482CB;
    transform: scale(0.96);
  }

  cursor: pointer;
`;