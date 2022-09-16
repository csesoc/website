import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';

import styled from "styled-components";

import { NavbarOpenHandler } from "../components/navbar/types";
import HamburgerMenu from "../components/navbar/HamburgerMenu";

import HomePageCurve from "../svgs/HPCurve.svg"
import TopRect from "../svgs/TopRect.svg"
import BottomRect from "../svgs/BottomRect.svg"

// local
import Navbar from "../components/navbar/Navbar";
import Homepage from "./MiniHomepage";
import Events from "./MiniEvents";
import AboutUs from "./MiniAboutUs";
import Sponsors from "./Sponsors";
import Resources from "./MiniResources";
import Support from "./MiniSupport";

import Footer from "../components/footer/Footer";
import { device } from '../styles/device'


type CurveContainerProps = {
  offset: number;
};

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  // padding-left: 2rem;
  // padding-right: 2rem;
`;

const CurveContainer = styled.div<CurveContainerProps>`
  position: absolute;
  top: ${props => props.offset}px;
  right: 0;
  z-index: -1;  
`;

const PurpleBlock = styled.div`
  background: #BEB8EA;
  width: 100vw;
  height: 135vh;
  position: relative;
  top: -10px;
`;

const Background = styled.div<{ offset?: number }>`
	position: absolute;
	top: ${(props) => props.offset}px;
	right: 0;
	z-index: -1;
`;

const RefLink = styled.div``

// const Background = styled.div``;

// const Button = styled.button`
//   background-color:#FFFFFF;
//   color: #3977F8;
//   font-size: 22px;
//   margin-top: 150px;
//   padding: 0.25em 1em;
//   border: 1px solid #3977F8;
//   border-radius: 3px;
//   position: absolute;
//   width: 184px;
//   height: 44px;
// `;

const Index: NextPage = () => {
  const [width, setWidth] = useState<undefined | number>();
  const [height, setHeight] = useState<undefined | number>();
  const [loaded, setLoaded] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);

  const handleToggle: NavbarOpenHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  const updateDimensions = () => {
    setWidth(window?.innerWidth);
    setHeight(window?.innerHeight);
  }

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    setLoaded(true)
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    setHeight(window?.innerHeight);
    setWidth(window?.innerWidth)
  }, [width])

  return (
    <PageContainer>
      <Head>
        <title>CSESoc</title>
        <meta name="description" content="CSESoc Website Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* {!navbarOpen && <Navbar open={navbarOpen} setNavbarOpen={handleToggle} />}
      {navbarOpen && <HamburgerMenu open={navbarOpen} setNavbarOpen={handleToggle} />}
      <Main>
        {(loaded && height && width) && (
          <>
            <Background>
              <CurveContainer offset={0}>
                <Image src={HomePageCurve} />
              </CurveContainer>
              <CurveContainer offset={height + 300}>
                <Image src={TopRect} />
                <PurpleBlock />
                <div style={{ position: 'relative', top: '-10px' }}>
                  <Image src={BottomRect} />
                </div>
              </CurveContainer>
            </Background>
            <RefLink id="homepage">
              <Homepage />
            </RefLink>
            <RefLink id="aboutus">
              <AboutUs />
            </RefLink>
            <RefLink id="events">
              <Events />
            </RefLink>
            <RefLink id="resources">
              <Resources />
            </RefLink>
            <RefLink id="support">
              <Support />
            </RefLink>
          </>
        )}
      </Main>
      <Footer /> */}
      <Sponsors/>
    </PageContainer>
  );
};

export default Index;
