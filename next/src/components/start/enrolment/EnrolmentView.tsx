import styled from "styled-components";
import Image from "next/image";
import NotanglesIcon from "../assets/notangles.svg";
import CirclesIcon from "../assets/circles.svg";
import UNSWIcon from "../assets/unsw.svg"
import EnrolmentBanner from "../assets/enrolment-guide-banner.png"
import { device } from "../../../styles/device";

const Circle = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 50%;
  width: 7vw;
  height: 7vw;
  background: #BEB8E7;
  border: 8px solid #B6AFE8;
  margin: 1vw;
  max-width: 130px;
  max-height: 130px;

  @media (max-width: 768px) {
    width: 20vw;
    height: 20vw;
    margin: 4vw;
  }
`

const ImageContainer = styled.div`
	position: absolute;
  margin: 5vw;
  width: 80vw;

  top: 35vh;
  width: 40vw;
  max-width: 500px;
  object-fit: contain;
  overflow: hidden;
  border-radius: 8px;
  margin: 0;
  z-index: 2;  


  @media (max-width: 768px) {
    top: 18.5vh;
    margin: 5vw;
    width: 80vw;
  
  }

`;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 70vh;

  padding-top: 10vh;

  @media (max-width: 768px) {
    min-height: 100vh;
    text-align: center;
    flex-direction: column;
    padding-top: 0;
  }
`

const LeftContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 50vw;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 80vw;
    min-height: 50vh;
    align-items: center;
  }
`

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 40%;
  align-items: center;
  @media (max-width: 768px) {
    flex: 1;
    width: 80vw;
  }
`

const IconDescription = styled.p`
  background: #FCF7DE;
  border-radius: 4px;
  width: 22vw;
  padding: 2vw;

  @media (max-width: 768px) {
    width: 50vw;
  }
  
`

const IconHeading = styled.div`
  background: #BEB8E7;
  color: #FFF;
  padding: 10px;
  border-radius: 4px;
  font-weight: 650;
  display: table-cell;
`

const HeadingBlock = styled.div`
  position: absolute;
  z-index: 3;
  background: #BEB8E7;
  color: #FFF;
  padding: 15px;
  border-radius: 4px;
  font-weight: 800;
  font-size: 1.2em;
  top: 32vh;
  @media (max-width: 768px) {
    top: 18vh;
  }
`

const ResourceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const IconInfoContainer = styled.div`
`

const EnrolmentDescriptionContainer = styled.div`
  position: absolute;
  width: 45vw;
  height: 25vh;
  text-align: center;
  background: #FCF7DE;
  border-radius: 6px;
  z-index: 1;
  top: 46vh;
  @media (max-width: 768px) {
    top: 30.5vh;
    width: 90vw;
  }

`

const EnrolmentDescription= styled.p`
  position: absolute;
  bottom: 0;
  padding: 2vw;
`

const Bold = styled.b`
  font-weight: bold;
`

export default function EnrolmentView() {
    return (
        <MainContainer>
            <LeftContainer>
              <HeadingBlock>Read our Enrolment Guide</HeadingBlock>
              <ImageContainer>
                <Image src={EnrolmentBanner} alt="Enrolment Banner" objectFit="contain" />
              </ImageContainer> 
              <EnrolmentDescriptionContainer>
                <EnrolmentDescription>
                  Just entering a CSE degree at UNSW, and feeling overwhelmed? <br/> <br/>
                  CSESoc has created the <Bold>CSE Enrolment Guide</Bold> help you make sense of it all! Check it out for a comprehensive rundown on everything you need to know about getting started with your degree - including understanding common terms, how majors work, and advice on subject selection and enrolment.
                </EnrolmentDescription>
              </EnrolmentDescriptionContainer>
            </LeftContainer>

            <RightContainer>
              <ResourceContainer>
                <Circle>
                  <Image src={NotanglesIcon} alt="Notangles Icon" width='70vw'/>
                </Circle>
                <IconInfoContainer>
                  <IconHeading>Notangles</IconHeading>
                  <IconDescription>Notangles is a student-led project which helps you <Bold>build your perfect timetable</Bold>, even before class registration opens.</IconDescription>
                </IconInfoContainer>
              </ResourceContainer>

              <ResourceContainer>
                <Circle>
                  <Image src={CirclesIcon} alt="Circles Icon" width='40vw'/>
                </Circle>
                <IconInfoContainer>
                    <IconHeading>Circles</IconHeading>
                    <IconDescription>Circles is a student-led project where you can <Bold>explore your degree structure</Bold> and <Bold>plan your degree</Bold> with ease.</IconDescription>
                </IconInfoContainer>
              </ResourceContainer>

              <ResourceContainer>
                <Circle>
                  <Image src={UNSWIcon} alt="UNSW Icon" width='40vw'/>
                </Circle>
                <IconInfoContainer>
                      <IconHeading>UNSW Handbook</IconHeading>
                      <IconDescription>The handbook is a comprehensive <Bold>guide to degree programs, specialisations and courses</Bold> offered at UNSW.</IconDescription>
                </IconInfoContainer>
              </ResourceContainer>

            </RightContainer>

        </MainContainer>
    );
}