import styled from "styled-components";

export const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  color: #000000;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledDottedContainer = styled.div`
  background: #ffffff;
  color: #a1a1a1;
  margin: 2vw 2.5vw;
  border-radius: 10px;
  border-width: 1vw;
  outline-style: dashed;
`;

export const StyledContent = styled.div`
  margin: 1.5vw 2.5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const MainText = styled.div`
  width: 90%;
  height: 90%;
  color: #5F5F5F;
  font-family: 'Arial';
  font-weight: 1vw;
  font-size: 1.5vw;
  margin: 1vw 0 0;
  text-align: center;
`;

export const BoldText = styled.span`
  font-weight: bold;
`