import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { content } from "../assets/execs.js";
// import currentExecs from "/root/cse/uni/cms.csesoc.unsw.edu.au/next/public/assets/currentExecs/2022.png";
import Image from "next/image";
import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const DescriptionBg = styled.div`
  width: 100%;
  height: 50vh;
  left: 0;
  top: 0;
  background-color: #A09FE3;
  z-index: -1;
  position: absolute;
`

export const Title = styled.div`
  padding-top: 12vh;
  padding-bottom: 5vh;
  font-family: 'Raleway';
  font-weight: 810;
  font-size: 45px;
  color: #FAFCFF;
`

export const CurrentExecs = styled.div`
  background-color: black;
  height: 40vh;
  width: 50vw;
`

export const HistoryText = styled.div`
  width: 50vw;
  font-family: 'Raleway';
  font-weight: 400;
  font-size: 17px;
  line-height: 22pt;
  word-wrap: break-word;
  text-align: center;
  padding-top: 1.5vw;
`

export const ImagesContainer = styled.div`
  border-top: 2px solid #A09FE3;
  width: 50vw;
  margin-top: 4vw;
  padding-top: 4vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`

export const IndividualImagesContainer = styled.div`
  padding-top: 1vw;
  font-family: 'Raleway';
  font-weight: 500;
  font-size: 17px;
  line-height: 22pt;
  word-wrap: break-word;
  text-align: center;
`

import { NavbarOpenHandler, NavbarType } from "../components/navbar/types";

export default function ExecDescription() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const handleToggle: NavbarOpenHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  function SponsorContainers() {
    return (
      <div>
        {content.map((E, index) => {
          <div
            key={index}
          >
            {console.log(E.alt_text)}
            <p>{E.alt_text}</p>
          </div>
          // <IndividualImagesContainer>
          //   {E.alt_text}
          //   {console.log("hello")}
          //   <div
          //     key={index}
          //     style={{ height: '23vw', width: '23vw' }}
          //   >
          //     <Image
          //       src={`/assets/execs/${E.execs}`}
          //       width="100%"
          //       height="100%"
          //       layout="responsive"
          //       objectFit="contain"
          //     />
          //   </div>
          // </IndividualImagesContainer>
        })}
      </div>
    );
  }

  return (
    <div>
      <Navbar open={navbarOpen} setNavbarOpen={handleToggle} variant={NavbarType.MINIPAGE} />
      <PageContainer>
        <DescriptionBg />
        <Title>Our History</Title>
        <CurrentExecs />
        {/* <Image
          src={currentExecs}
          width="100%"
          height="100%"
          layout="responsive"
          objectFit="contain"
        /> */}
        <HistoryText>
          CSESoc was formed in October 2006 from the old CompSoc and SESoc  societies. CompSoc helped represent the interest of students studying  Computer Engineering, Computer Science and postgraduate courses, while  SESoc was the representative body for Software Engineering students.  Both societies provided technical and social support to their members.  In the best interest of everyone, the societies merged to provide a  better experience to all CSE students.
        </HistoryText>
        <HistoryText>
          CSESoc now represents students enrolled in Computer Science, Computer  Engineering, Software Engineering, Bioinformatics Engineering, or a  post‐graduate program administered by CSE (research or coursework).
        </HistoryText>
        <HistoryText>
          Even today CSESoc continues to be an integral part of the student  experience. Many students make the most of their time at university by  joining a working group in first year to get a taste of the society. If  you are enthusiastic and interested you can nominate yourself or be  nominated for a position in the Exec at the end of the year.
        </HistoryText>
        <HistoryText>
          Being part of a society is a great way to meet new people and gain extra skills that employers look for in the industry.
        </HistoryText>
        <SponsorContainers />
      </PageContainer>
    </div>
  );
}