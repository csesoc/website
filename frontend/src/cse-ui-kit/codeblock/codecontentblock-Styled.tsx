/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import styled from "styled-components";

export type StyledProps = {
  focused?: boolean;
}

export const StyledCodeContent = styled.div<StyledProps>`
  width: 100%;
  max-width: 600px;
  background: #f7f7f7;
  color: #000000;
  box-shadow: ${(props) => props.focused && '0px 2px 3px rgba(0, 0, 0, 0.25);'}
  padding: 30px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
  font-family: monospace;
`;

export const StyledCodeContentDots = styled.div`
  height: 100;
  cursor: pointer;
`;
