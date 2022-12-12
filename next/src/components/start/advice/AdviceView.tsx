import Image from "next/image";
import styled from "styled-components";
import InfoCard from "./InfoCard";

const MainButton = styled.button`
  outline: none;
  border: 0;
  border-radius: 5px;
  height: 100px;
  width: 440px;
  background-color: #BEB8E7;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  cursor: pointer;
`;

const MainContainer = styled.div`
  flex: 1;
`;

const InfoCardsContainer = styled.div`
  height: 50%;
  display: flex;
  justify-content: space-around;
`;

const MainButtonContainer = styled.div`
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export default function AdviceView() {
  return (
    <MainContainer>
      <InfoCardsContainer>
        <InfoCard />
        <InfoCard />
        <InfoCard />
        <InfoCard />
      </InfoCardsContainer>
      <MainButtonContainer>
        <MainButton>
          Check out our First Year Guide
        </MainButton>
      </MainButtonContainer>
    </MainContainer >
  );
}