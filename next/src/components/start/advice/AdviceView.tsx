import Image from "next/image";
import styled from "styled-components";
import InfoCard from "./InfoCard";
import Example from "../../../assets/example.png";
import MakingFriends from "../../../assets/makingfriends.png";
import FirstDay from "../../../assets/firstday.png";
import WishIKnew from "../../../assets/wishiknew.png";
import StudyTips from "../../../assets/studytips.png";
import { device } from "../../../styles/device";

const MainButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  border: 0;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  background-color: #beb8e7;
  cursor: pointer;
  :hover {
    background-image: linear-gradient(rgb(0 0 0/40%) 0 0);
  }

  height: 48px;
  width: 288px;
  font-size: 18px;

  @media ${device.laptop} {
    height: 60px;
    width: 320px;
    font-size: 20px;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const InfoCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  // This is to set the bounds of the container to allow the scrollbar to show up
  position:absolute;
  left: 0;
  right: 0;
  top:0;
  bottom: 30px;

  
  @media ${device.laptop} {
    justify-content: space-around;
    flex-direction: row;
    position: relative;
  }
`;

const MainButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  padding-top: 36px;

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
  {
    title: "A Guide to Making Friends at UNSW",
    text: "In this video, get all the real tips from your peers on ways to make new friends at UNSW!",
    image: MakingFriends,
    link: "https://media.csesoc.org.au/making-friends/",
  },
  {
    title: "CSESoc Subcom",
    text: "Pack your bag for the first day of uni and we'll tell you what CSESoc Subcom to join!",
    image: FirstDay,
    link: "https://media.csesoc.org.au/quiz-subcom/",
  },
  {
    title: "Optimise Your Study Life",
    text: "The first of a two-part series, Alex has compiled all the tips and habits you need to optimise your study life!",
    image: StudyTips,
    link: "https://media.csesoc.org.au/study-tips-and-habits/",
  },
  {
    title: "What I wish I knew as a First Year",
    text: "Join Raathan, Sunny, Paul, Angeni and Ryan as they discuss their first year university experiences!",
    image: WishIKnew,
    link: "https://media.csesoc.org.au/2020-roundtable/",
  },
];

export default function AdviceView() {
  return (
    <MainContainer>
      <InfoCardsContainer>
        {info.map((info, index) => (
          <InfoCard
            key={index}
            title={info.title}
            text={info.text}
            image={info.image}
            link={info.link}
          />
        ))}
      </InfoCardsContainer>
      <MainButtonContainer>
        <MainButton
          as="a"
          href="https://media.csesoc.org.au/first-year-guide/"
          target="_blank"
          rel="noreferrer"
        >
          Check out our First Year Guide
        </MainButton>
      </MainButtonContainer>
    </MainContainer>
  );
}
