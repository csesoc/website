import styled from "styled-components";
import Image from "next/image";
import { device } from "../../../styles/device";
import EventTab from "./EventTab";

const MainContainer = styled.div`
  display: flex;
  justify-content: space-around;
  height: 100%;
`

const ImageContainer = styled.div`
  display: flex;
  width: 50vw;
  max-width: 2000px;
  object-fit: contain;
  overflow: hidden;
  border-radius: 8px;
  border-style: solid;
  max-height: 70vh;
`;

const Sidebar = styled.div`
  width: 20vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  max-height: 70vh;
`

const events = [
  {
    title: "Peer Mentoring",
    date: "TBD"
  },
  {
    title: "First Year Camp",
    date: "TBD"
  },
  {
    title: "Lab 0",
    date: "TBD"
  },
  {
    title: "CSESoc BBQ",
    date: "TBD"
  },
  {
    title: "CSESoc Subcommittee Recruitment",
    date: "TBD"
  },
];


export default function EventsView() {
  return (
      <MainContainer>
          <Sidebar>
              {events.map((info, index) => (
                <EventTab
                  key={index}
                  title={info.title}
                  date={info.date}
                />
            ))}
          </Sidebar>
          <ImageContainer>

          </ImageContainer>

      </MainContainer>
  );
}