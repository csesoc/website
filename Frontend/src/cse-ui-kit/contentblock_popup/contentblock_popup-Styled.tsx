import styled from "styled-components";

export const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 400px;
  background: #ffffff;
  color: #000000;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25);
  padding: 30px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

export const StyledContent = styled.div`
  width: 90%;
  background: #ffffff;
  color: #000000;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border-radius: 5px;
  outline-width: thin;
  outline-style: dashed;
`;
export const MainText = styled.div`
  color: #5F5F5F;
  /* font-family: 'Roboto'; */
  font-size: 2vw;
  line-height: 75px;
  text-align: center;
`;

export const BoldText = styled.span`
  font-weight: bold;
`

export const StyledContentDots = styled.div`
  height: 100;
  cursor: pointer;
`;
