import styled from "styled-components";

export type buttonProps = {
  background?: string;
  middleBackground: string;
  size: string;
}
export const StyledButton = styled.div<buttonProps>`
  height: ${props => props.size};
  width: ${props => props.size};
  background: ${props => props.background};
  color: #2B3648;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${props => (parseInt(props.size) / 10).toString() + "px"};

  &:hover {
    background: #EFEEF3;
    color: #2B3648;
    transform: scale(1.04);
  }
  &:active {
    background: #C8D1FA;
    color: #7482CB;
    transform: scale(0.96);
  }

  cursor: pointer;
`;