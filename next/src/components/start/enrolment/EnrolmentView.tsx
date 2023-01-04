import styled from "styled-components";
import Image from "next/image";
import NotanglesIcon from "../assets/notangles.svg";
import CirclesIcon from "../assets/circles.svg";
import UNSWIcon from "../assets/unsw.svg";
import EnrolmentBanner from "../assets/enrolment-guide-banner.png";
import Link from "next/link";

const Circle = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  border-radius: 50%;
  width: 85px;
  height: 85px;
  background: #beb8e7;
  border: 8px solid #b6afe8;
  margin: 10px;
  max-width: 130px;
  max-height: 130px;
`;

const ImageContainer = styled.div`
  max-width: 500px;
  padding: 0 20px;
  object-fit: contain;
  overflow: hidden;
  border-radius: 8px;
  margin: 0;
  z-index: 2;
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  height: 100%;

  @media (max-width: 768px) {
    min-height: 100vh;
    text-align: center;
    flex-direction: column;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    min-height: 50vh;
    padding: 10px;
    align-items: center;
  }
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 20px;
  width: 40%;
  align-items: center;
  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
    max-width: 500px;
    padding: 0 10px;
    margin: 0 auto;
  }
`;

const IconDescription = styled.p`
  background: #fcf7de;
  border-radius: 4px;
  padding: 2vw;
  margin: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const IconHeading = styled.div`
  background: #beb8e7;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  font-weight: 650;
  display: table-cell;
  &:hover {
    transform: scale(1.04);
  }
`;

const HeadingBlock = styled.div`
  margin-bottom: -20px;
  z-index: 3;
  background: #beb8e7;
  color: #fff;
  padding: 15px;
  border-radius: 4px;
  font-weight: 800;
  font-size: 1.2em;

  &:hover {
    transform: scale(1.04);
  }

  @media (max-width: 768px) {
    top: 18vh;
  }
`;

const ResourceContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
`;

const EnrolmentDescriptionContainer = styled.div`
  padding-top: 100px;
  margin-top: -100px;
  text-align: center;
  background: #fcf7de;
  border-radius: 6px;
  z-index: 1;
`;

const EnrolmentDescription = styled.p`
  padding: 2vw;
`;

const Bold = styled.b`
  font-weight: bold;
`;

export default function EnrolmentView() {
  return (
    <MainContainer>
      <LeftContainer>
        <HeadingBlock>
          <Link href="https://media.csesoc.org.au/enrolment-guide/">Read our Enrolment Guide</Link>
        </HeadingBlock>
        <ImageContainer>
          <Image src={EnrolmentBanner} alt="Enrolment Banner" objectFit="contain" />
        </ImageContainer>
        <EnrolmentDescriptionContainer>
          <EnrolmentDescription>
            Just entering a CSE degree at UNSW, and feeling overwhelmed? <br /> <br />
            CSESoc has created the <Bold>CSE Enrolment Guide</Bold> help you make sense of it all!
            Check it out for a comprehensive rundown on everything you need to know about getting
            started with your degree - including understanding common terms, how majors work, and
            advice on subject selection and enrolment.
          </EnrolmentDescription>
        </EnrolmentDescriptionContainer>
      </LeftContainer>

      <RightContainer>
        <ResourceContainer>
          <Circle>
            <Image src={NotanglesIcon} alt="Notangles Icon" width="70vw" />
          </Circle>
          <IconInfoContainer>
            <IconHeading>
              <Link href="https://notangles.csesoc.app/">Notangles</Link>
            </IconHeading>
            <IconDescription>
              Notangles is a student-led project which helps you{" "}
              <Bold>build your perfect timetable</Bold>, even before class registration opens.
            </IconDescription>
          </IconInfoContainer>
        </ResourceContainer>

        <ResourceContainer>
          <Circle>
            <Image src={CirclesIcon} alt="Circles Icon" width="40vw" />
          </Circle>
          <IconInfoContainer>
            <IconHeading>
              <Link href="https://circles.csesoc.app/degree-wizard/">Circles</Link>
            </IconHeading>
            <IconDescription>
              Circles is a student-led project where you can{" "}
              <Bold>explore your degree structure</Bold> and <Bold>plan your degree</Bold> with
              ease.
            </IconDescription>
          </IconInfoContainer>
        </ResourceContainer>

        <ResourceContainer>
          <Circle>
            <Image src={UNSWIcon} alt="UNSW Icon" width="40vw" />
          </Circle>
          <IconInfoContainer>
            <IconHeading>
              <Link href="https://www.handbook.unsw.edu.au/">UNSW Handbook</Link>
            </IconHeading>
            <IconDescription>
              The handbook is a comprehensive{" "}
              <Bold>guide to degree programs, specialisations and courses</Bold> offered at UNSW.
            </IconDescription>
          </IconInfoContainer>
        </ResourceContainer>
      </RightContainer>
    </MainContainer>
  );
}
