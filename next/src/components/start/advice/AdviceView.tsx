import Image from "next/image";
import styled from "styled-components";
import InfoCard from "./InfoCard";
import Example from "../../../assets/example.png";
import { device } from "../../../styles/device";

const MainButton = styled.button`
  outline: none;
  border: 0;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  background-color: #BEB8E7;
  cursor: pointer;
  :hover {
    background-image: linear-gradient(rgb(0 0 0/40%) 0 0);
  }

  @media ${device.mobileS} {
    height: 48px;
    width: 288px;
    font-size: 18px;
  }

  @media ${device.laptop} {
    height: 60px;
    width: 320px;
    font-size: 22px;
  }
  @media ${device.laptopL} {
    height: 80px;
    width: 400px;
    font-size: 26px;
  }
  @media ${device.desktop} {
    height: 100px;
    width: 480px;
    font-size: 30px;
  }
`;

const MainContainer = styled.div`
  flex: 1;
`;

const InfoCardsContainer = styled.div`
  display: flex;

  @media ${device.mobileS} {
    height: 60vh;
    flex-direction: column;
    overflow-y: scroll;
  }

  @media ${device.laptop} {
    justify-content: space-around;
    height: 360px;
    flex-direction: row;
  }
  
  @media ${device.laptopL} {
    height: 450px;
  }

  @media ${device.desktop} {
    height: 540px;
  }
`;

const MainButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  @media ${device.mobileS} {
    padding-top: 36px;
  }

  @media ${device.laptop} {
    padding-top: 48px;
  }
  @media ${device.laptopL} {
    padding-top: 56px;
  }
  @media ${device.desktop} {
    padding-top: 64px;
  }
`;

const info = [
  { title: 'Title1', text: 'text1', image: Example },
  { title: 'Title2', text: 'text2', image: Example },
  { title: 'Title3', text: 'text3', image: Example },
  { title: 'Title4', text: 'text4', image: Example },
]

export default function AdviceView() {
  return (
    <MainContainer>
      <InfoCardsContainer>
        {info.map((info, index) => <InfoCard key={index} title={info.title} text={info.text} image={info.image} />)}
      </InfoCardsContainer>
      <MainButtonContainer>
        <MainButton>
          Check out our First Year Guide
        </MainButton>
      </MainButtonContainer>
    </MainContainer >
  );
}