import styled from "styled-components";
import Image from "next/image";
import { device } from "../../../styles/device";
import EventTab from "./EventTab";
import { useState, useEffect } from "react";
import PeerMentoring from "../assets/peer-mentoring.png";

const MainContainer = styled.div`
  display: flex;
  justify-content: space-around;
  height: 100%;
`

const ImageContainer = styled.div`
  max-width: 700px;
  object-fit: contain;
  overflow: hidden;
  padding: 12px 0px;

  &:hover { 
		cursor: pointer;
		transform: scale(1.1);
	}

`;

const RightContainer = styled.div`
  display: flex;
  width: 50vw;
  max-width: 2000px;
  object-fit: contain;
  overflow: hidden;
  background: #beb8e7;
  // border: 4px solid #beb8e7;
  border-radius: 8px;
  max-height: 70vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Sidebar = styled.div`
  width: 20vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  max-height: 40vh;
  @media (max-width: 768px) {
    min-width: 35vw;
    min-height: 70vh;
    padding: 10px;
    align-items: center;
  }
`

const DescContainer = styled.div`
  display: flex;
  padding: 0 25px;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const events = [
  {
    title: "Peer Mentoring",
    date: "22nd Feb 2-5pm",
    imageName: PeerMentoring,
    desc: "Join us for a term of fun and bond with other first years in groups led by our experienced CSE students! Keep an eye out on your emails for more information. Sign ups will open on 1st Feb and close on 15th Feb."
  },
  {
    title: "First Year Camp",
    date: "24th Feb",
    imageName: null,
    // "./assets/camp.png"
    desc: "First year camp is just around the corner! If this is your first year doing a CSE degree, or you're in your first year doing a COMP subject, then this is the camp for you! Come make life long uni friends over the weekend of 24th Feb to 26th Feb. Keep an eye out on our social media for ticket releases."
  },
  {
    title: "Lab 0",
    date: "22nd Feb",
    imageName: null,
    // "./assets/lab-0.png"
    desc: "Lab 0 is an introductory workshop for students taking COMP1511 or starting a CSE degree. Come get your setup optimised for the best coding experience!. Location TBD, keep an eye out on our social media for more information."
  },
  {
    title: "CSESoc BBQ",
    date: "Wednesday Weekly",
    imageName: null,
    // "./assets/bbq.png"
    desc: "Head down to John Lions Garden near K17 every Wednesdays 12-2pm for our famous free BBQ! This is only available for students studying a CSE degree."
  },
  {
    title: "Subcommittee Recruitment",
    date: "TBD",
    imageName: null,
    // "./assets/subcom.png"
    desc: "Want to make a contribution to CSESoc and make friends while doing so? Then we would suggest applying to one of CSESoc's many teams! Keep your eyes peeled on our social media so you don't miss out on recruitment."
  },
];



export default function EventsView() {

  const [image, setImage] = useState(events[0].imageName);
  const [desc, setDesc] = useState(events[0].desc);

  return (
      <MainContainer>
          <Sidebar>
              {events.map((info, index) => (
                <EventTab
                  key={index}
                  title={info.title}
                  date={info.date}
                  onClick={() => {
                    setImage(info.imageName); 
                    setDesc(info.desc);
                  }}
                />
            ))}
          </Sidebar>
          <RightContainer>
            <ImageContainer>
              { image !== null 
                ? <Image src={image} objectFit="contain" alt="event banner"/>
                : <p> More Info Coming Soon</p>
              }
            </ImageContainer>
            <DescContainer>
              {desc}
            </DescContainer>
            
          </RightContainer>

      </MainContainer>
  );
}