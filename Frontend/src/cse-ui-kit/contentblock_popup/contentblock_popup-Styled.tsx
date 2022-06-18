import styled from "styled-components";

export const StyledContainer = styled.div`
  width: max-content;
  height: max-content;
  background: #ffffff;
  color: #000000;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

export const StyledDottedContainer = styled.div`
  margin: 3vw 5vw;
  background: #ffffff;
  color: #000000;
  margin: 3vw 4vw;
  border-radius: 5px;
  border-width: 2vw;
  outline-style: dashed;
`;

export const StyledContent = styled.div`
  margin: 3vw 7vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

export const MainText = styled.div`
  color: #5F5F5F;
  font-family: 'Arial';
  font-weight: 1vw;
  font-size: 2vw;
  margin: 2vw 0 0;
  text-align: center;
`;

export const BoldText = styled.span`
  font-weight: bold;
`