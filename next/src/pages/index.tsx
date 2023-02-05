import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';

import styled from "styled-components";

import { NavbarOpenHandler, NavbarType } from "../components/navbar/types";
import HamburgerMenu from "../components/navbar/HamburgerMenu";

import HPCurve from "../svgs/HPCurve"
import TopRect from "../svgs/TopRect.svg"
import BottomRect from "../svgs/BottomRect.svg"

// local
import Navbar from "../components/navbar/Navbar";
import Homepage from "./MiniHomepage";
import Events from "./MiniEvents";
import AboutUs from "./MiniAboutUs";
import Resources from "./MiniResources";
import Support from "./MiniSupport";

import Footer from "../components/footer/Footer";
import { size as deviceSize, device } from '../styles/device'
import { SectionFadeInFromLeft, SectionFadeInFromRight } from "../styles/motion"
import ExecDescription from "./ExecDescription";

type CurveContainerProps = {
  offset: number;
};

const PageContainer = styled.div`
  max-width: 2560px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const CurveContainer = styled.div<CurveContainerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  top: ${props => props.offset}/3px;
  right: 0;
	z-index: -1;
  @media ${device.tablet} {
    top: -${props => props.offset}px;
  }
`;

const NavContainer = styled.div`
  height: 10vh;
`

const PurpleBlock = styled.div`
  background: #BEB8EA;
  width: 100%;
  @media ${device.tablet} {
    height: 135vmin;
  }
`;

const Background = styled.div<{ offset?: number }>`
	position: absolute;
	right: 0;
	z-index: -1;
  height: auto;
`;

const RefLink = styled.div``



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
    <>
      <NavContainer>
        {!navbarOpen && <Navbar open={navbarOpen} setNavbarOpen={handleToggle} variant={NavbarType.HOMEPAGE} />}
        {navbarOpen && <HamburgerMenu open={navbarOpen} setNavbarOpen={handleToggle} />}
      </NavContainer>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
        <PageContainer>
          <Head>
            <title>CSESoc</title>
            <meta name="description" content="CSESoc Website Homepage" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          {(loaded && height && width) && (
            <>
              <Background>
                <CurveContainer offset={0}>
                  {/* <Image src={HPCurve} objectFit="cover"/> */}
                  <HPCurve />
                </CurveContainer>
                <CurveContainer offset={height}>
                  <Image alt="purple-top-bg" src={TopRect} />
                  <PurpleBlock />
                  <Image alt="purple-bottom-bg" src={BottomRect} />
                </CurveContainer>
              </Background>
              <RefLink id="homepage">
                <Homepage />
              </RefLink>
              <RefLink id="aboutus">
                {/* <SectionFadeInFromRight> */}
                <AboutUs />
                {/* </SectionFadeInFromRight> */}
              </RefLink>
              <RefLink id="events">
                {/* <SectionFadeInFromLeft> */}
                <Events />
                {/* </SectionFadeInFromLeft> */}
              </RefLink>
              <RefLink id="resources">
                <Resources />
              </RefLink>
              <RefLink id="support">
                <Support />
              </RefLink>
            </>
          )}

        </PageContainer >
        <Footer />
      </div>
    </>
  );
};

export default Index;
