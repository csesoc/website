import styled from "styled-components";

export type containerProps = {
  background?: string;
}
export const StyledContainer = styled.div<containerProps>`
    background-color: white;
    width: 300px;
    min-height: 200px;
    margin: 30px auto;
    box-sizing: border-box;
    padding: 30px;
    border: 35px solid #F0F0F0;
    outline-style:dashed;
    outline-color:#909090;
    outline-offset: -35px;
`;