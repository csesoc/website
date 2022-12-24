import styled from "styled-components";

const lightPurple = "hsl(248, 50%, 81%)";
const darkPurple = "hsl(248, 87%, 73%)";

type ButtonProps = {
  filled: boolean;
  active: boolean;
};

export const Button = styled.button<ButtonProps>`
  background: ${({ filled }) => (filled ? darkPurple : lightPurple)};
  border: none;
  color: white;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1) ${({ active }) => (active ? ", 0 0 0 3px hsla(248, 87%, 73%, 0.5)" : "")};
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  :hover {
    background: #a09fe3;
  }
`;

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Buttons = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
`;

type CircleProps = {
  filled: boolean;
};

export const Circle = styled.button<CircleProps>`
  border-radius: 100%;
  border: 5px solid ${({ filled }) => (filled ? darkPurple : lightPurple)};
  width: 25px;
  height: 25px;
  background-color: ${({ filled }) => (filled ? lightPurple : "#fcf7de")};
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  cursor: pointer;
  transition: background-color 0.2s;
`;

export const Line = styled.div`
  flex: 1;
  height: 6px;
  background-image: linear-gradient(to right, #c0cff8, #b1a6ff);
  margin: 0 12.5px;
`;

export const ProgressLineWrapper = styled.div`
  position: absolute;
  left: 12.5px;
  right: 12.5px;
  height: 6px;
`;

type ProgressLineProps = {
  progressPercent: number;
};

export const ProgressLine = styled.div<ProgressLineProps>`
  height: 100%;
  background-color: ${darkPurple};
  width: ${({ progressPercent }) => progressPercent}%;
  transition: width 0.5s;
`;
