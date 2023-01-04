import React, { ReactElement, ReactNode, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { NavbarOpenHandler, NavbarType } from "../components/navbar/types";
import styled from "styled-components";
import WelcomeView from "../components/start/welcome/WelcomeView";
import AdviceView from "../components/start/advice/AdviceView";
import EnrolmentView from "../components/start/enrolment/EnrolmentView";
import ConnectView from "../components/start/connect/ConnectView";
import EventsView from "../components/start/events/EventsView";
import useTimelineScroll from "../hooks/TimelineScroll";
import Timeline from "../components/start/timeline/Timeline";
import View from "../components/start/view/View";

const MainContainer = styled.div`
  padding: 20px;
  font-family: "Raleway";
  font-weight: 450;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  flex: 1;

  > :first-child {
    flex: 1;
  }

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const PageContainer = styled.div`
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  display: flex;
  overflow: hidden;
`;

const views: Record<string, ReactNode> = {
  Welcome: <WelcomeView />,
  Connect: <ConnectView />,
  Advice: <AdviceView />,
  Enrolment: <EnrolmentView />,
  Events: <EventsView />,
};

export default function Start() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const handleToggle: NavbarOpenHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  const [scrolling, handleScroll, focusedView, setFocusedView] = useTimelineScroll(
    Object.keys(views).length,
    1000,
    () => scrolling.current,
  );

  return (
    <PageContainer>
      <Navbar open={navbarOpen} setNavbarOpen={handleToggle} variant={NavbarType.MINIPAGE} />
      <MainContainer onWheel={e => handleScroll(e.deltaY)}>
        <Main>
          {Object.values(views).map((view, i) => (
            <View key={i} idx={i} focusedView={focusedView}>
              {view}
            </View>
          ))}
        </Main>
        <Timeline
          focusedView={focusedView}
          setFocusedView={setFocusedView}
          viewNames={Object.keys(views)}
        />
      </MainContainer>
    </PageContainer>
  );
}
