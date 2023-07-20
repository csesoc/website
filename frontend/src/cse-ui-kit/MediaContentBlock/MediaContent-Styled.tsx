import styled from "styled-components";

export type buttonProps = {
  background?: string;
};

export const StyledContent = styled.div`
  // background: #f7f7f7;
  items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Text = styled.p`
  word-wrap: initial;
  display: flex;
  align-items: bottom;
`;