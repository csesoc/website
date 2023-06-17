import styled from "styled-components";

export type buttonProps = {
  background?: string;
};
// width: 175px;
// height: 45px;
// margin: 5px;
export const StyledTextBox = styled.input`
  background: transparent;

  border: none;
  border-color: transparent;

  
  padding: 0.5em;
  
  font-size: inherit;
  
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  
  &:hover {
    cursor: text;
    color: black;
    transform: scale(1.04);
  }

  cursor: pointer;
`;
