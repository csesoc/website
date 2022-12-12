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
  width: 110px;
  height: 110px;
  background: #BEB8E7;
  border: 8px solid #B6AFE8;
`

const ImageContainer = styled.div`
	position: absolute;
  width: 50vw;
  height: 20vh;
  z-index: 2;
  top: 32vh;

  @media ${device.laptop} {
    width: 400px;
    height: 450px;
    object-fit: contain;
    overflow: hidden;
    border-radius: 8px;
  }

`;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  // width: 70vw;
  align-items: center;
  height: 70vh;
`

const LeftContainer = styled.div`
  display: flex;
  justify-content: center;
  // align-items: center;
  // width: 600px;
  // height: 600px;
  width: 50%;
`

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  justify-content: space-between;
`

const IconDescription = styled.div`
  display: flex;
  background: #FCF7DE;
  border-radius: 4px;
  height: 100px;
  width: 300px;
  padding: 15px;
  
`

const IconHeading = styled.div`
  display: flex;
  background: #BEB8E7;
  // justify-content: center;
  // align-items: center;
  color: #FFF;
  padding: 10px;
  // height: auto;
  // width: auto;
  // height: 40px;
  // width: 10em;
  border-radius: 4px;
  font-weight: 600;
`

const HeadingBlock = styled.div`
  position: absolute;
  z-index: 3;
  background: #BEB8E7;
  color: #FFF;
  padding: 10px;
  border-radius: 4px;
  font-weight: 800;
  font-size: 1em;
  top: 30vh;
`

const ResourceContainer = styled.div`
  display: flex;
`

const IconInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  // justify-content: space-around;
`

const EnrolmentDescriptionContainer = styled.div`
  position: absolute;
  width: 500px;
  height: 275px;
  text-align: center;
  background: #FCF7DE;
  border-radius: 6px;
  z-index: 1;

`

const EnrolmentDescription= styled.p`
  position: absolute;
  bottom: 0;
  padding: 30px;
`

export default function EnrolmentView() {
    return (
        <MainContainer>
            <LeftContainer>
              <HeadingBlock>Read our Enrolment Guide</HeadingBlock>
              <ImageContainer>
                <Image src={EnrolmentBanner} alt="Enrolment Banner"/>
              </ImageContainer> 
              <EnrolmentDescriptionContainer>
                <EnrolmentDescription>
                  Just entering a CSE degree at UNSW, and feeling overwhelmed? <br/> <br/>
                  CSESoc has created the CSE Enrolment Guide help you make sense of it all! Check it out for a comprehensive rundown on everything you need to know about getting started with your degree - including understanding common terms, how majors work, and advice on subject selection and enrolment.
                </EnrolmentDescription>
              </EnrolmentDescriptionContainer>
            </LeftContainer>

            <RightContainer>
              <ResourceContainer>
                <Circle>
                  <Image src={NotanglesIcon} alt="Notangles Icon"/>
                </Circle>
                <IconInfoContainer>
                  <IconHeading>Notangles</IconHeading>
                  <IconDescription>Notangles is a student-led project which helps you build your perfect timetable, even before class registration opens.</IconDescription>
                </IconInfoContainer>
              </ResourceContainer>

              <ResourceContainer>
                <Circle>
                  <Image src={CirclesIcon} alt="Circles Icon"/>
                </Circle>
                <IconInfoContainer>
                    <IconHeading>Circles</IconHeading>
                    <IconDescription>Circles is a student-led project where you can explore your degree structure and plan your degree with ease.</IconDescription>
                </IconInfoContainer>
              </ResourceContainer>

              <ResourceContainer>
                <Circle>
                  <Image src={UNSWIcon} alt="UNSW Icon"/>
                </Circle>
                <IconInfoContainer>
                      <IconHeading>UNSW Handbook</IconHeading>
                      <IconDescription>The handbook is a comprehensive guide to degree programs, specialisations and courses offered at UNSW.</IconDescription>
                </IconInfoContainer>
              </ResourceContainer>



            </RightContainer>

        </MainContainer>
    );
}