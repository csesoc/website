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
import Otter from '../svgs/otter.png'

// local
import Navbar from "../components/navbar/Navbar";
import Homepage from "./MiniHomepage";
import Events from "./MiniEvents";
import AboutUs from "./MiniAboutUs";
import Resources from "./MiniResources";
import Support from "./MiniSupport";

import Footer from "../components/footer/Footer";
import { device } from '../styles/device'
import { SectionFadeInFromLeft, SectionFadeInFromRight, Spin } from "../styles/motion"

type CurveContainerProps = {
  offset: number;
};

const PageContainer = styled.div`
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const CurveContainer = styled.div<CurveContainerProps>`
  position: absolute;
  top: ${props => props.offset}px;
  right: 0;
  z-index: -1;  
`;

const NavContainer = styled.div`
  height: 10vh;
`

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

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`



const Index: NextPage = () => {
  const [width, setWidth] = useState<undefined | number>();
  const [height, setHeight] = useState<undefined | number>();
  const [loaded, setLoaded] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(true);

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

  setTimeout(() => {
    setFakeLoading(false);
  }, 2000)

  if(fakeLoading) {
    return (
      <Spin>
        <PageContainer>
          <LoaderContainer>
            <Image src={Otter}/>
          </LoaderContainer>
        </PageContainer>
      </Spin>
    )
  }

  return (
    <PageContainer>
      <Head>
        <title>CSESoc</title>
        <meta name="description" content="CSESoc Website Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavContainer>
        {!navbarOpen && <Navbar open={navbarOpen} setNavbarOpen={handleToggle} variant={NavbarType.HOMEPAGE}/>}
        {navbarOpen && <HamburgerMenu open={navbarOpen} setNavbarOpen={handleToggle} />}
      </NavContainer>
      {(loaded && height && width) && (
        <>
          <Background>
            <CurveContainer offset={0}>
              {/* <Image src={HPCurve} objectFit="cover"/> */}
              <HPCurve/>
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
            <SectionFadeInFromRight>
              <AboutUs />
            </SectionFadeInFromRight>
          </RefLink>
          <RefLink id="events">
            <SectionFadeInFromLeft>
              <Events />
            </SectionFadeInFromLeft>
          </RefLink>
          <RefLink id="resources">
            <Resources />
          </RefLink>
          <RefLink id="support">
            <Support />
          </RefLink>
          <Footer />
        </>
      )}

    </PageContainer>
  );
};

export default Index;
