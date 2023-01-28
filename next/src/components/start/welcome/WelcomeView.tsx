import styled, { keyframes } from "styled-components";
import Countdown from "./Countdown";
import { device } from "../../../styles/device";

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 30px;
`;

const blink = keyframes`  
  50% {
    color: #beb8e740;
  }
`;

const CountdownTimer = styled.div`
  position: absolute;
  color: #beb8e7;
  background-color: white;
  font-family: monospace;
  outline: none;
  border: 0;
  opacity: 1;
  transition: opacity .5s ease-out;
  animation: ${blink} 2s ease-in-out infinite;
  
  font-size: 30px;

  @media ${device.tablet} {
    font-size: 40px;
  }

  @media ${device.laptop} {
    font-size: 80px;
  }

  @media ${device.laptopL} {
    font-size: 150px;
  }
`;

const CountdownLink = styled.button`
  position: absolute;
  visibility: hidden;
  opacity: 0;
  color: white;
  background-color: #beb8e7;
  transition: opacity .5s ease-in;
  border: 0;
  width: 100%;
  height: 100%;

  font-size: 20px;

  @media ${device.tablet} {
    font-size: 30px;
  }

  @media ${device.laptop} {
    font-size: 60px;
  }

  @media ${device.laptopL} {
    font-size: 100px;
  }

  cursor: pointer;
`;

const CountdownContainer = styled.div`
  font-weight: bold;
  border: 5px solid #beb8e7;
  border-radius: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  :hover ${CountdownTimer} {
    visibility: hidden;
    opacity: 0;
  }

  :hover ${CountdownLink} {
    opacity: 1;
    visibility: visible;
  }

  position: relative;

  width: 300px;
  height: 45px;

  @media ${device.tablet} {
    width: 400px; 
    height: 60px;
  }

  @media ${device.laptop} {
    width: 800px;
    height: 120px;
  }

  @media ${device.laptopL} {
    width: 1400px;
    height: 200px;
  }
`;

const RowContainer = styled.div`
  flex: 1;
  display: flex;
`;


const LabelText = styled.span`
  font-size: 15px;

  @media ${device.laptop} {
    font-size: 30px;
  }

  @media ${device.laptopL} {
    font-size: 50px;
  }
`;

const LabelAccent = styled.span`
  color: #3977f8;
  font-weight: bold;

  font-size: 25px;

  @media ${device.laptop} {
    font-size: 50px;
  }

  @media ${device.laptopL} {
    font-size: 80px;
  }
`;

export default function WelcomeView() {
  return (
    <MainContainer>
      <RowContainer />
      <CountdownContainer
        as="a"
        href="https://www.arc.unsw.edu.au/o-week"
        target="_blank"
        rel="noreferrer"
      >
        <CountdownLink>
          See what&apos; on at O-Week!
        </CountdownLink>
        <CountdownTimer>
          <Countdown />
        </CountdownTimer>
      </CountdownContainer>
      <RowContainer>
        <LabelText>
          Countdown to&nbsp;
          <LabelAccent>
            O-WEEK
          </LabelAccent>
        </LabelText>
      </RowContainer>
    </MainContainer>
  );
}