import type { NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import { useState, useEffect } from "react";

import styled from "styled-components";

import HomePageCurve from "../svgs/HPCurve.svg"
import TopRect from "../svgs/TopRect.svg"
import BottomRect from "../svgs/BottomRect.svg"

// local
import Homepage from "./Homepage";
import Events from './Events'
import AboutUs from './AboutUs';

import { device } from '../styles/device'


type CurveContainerProps = {
  offset: number;
}

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-left: 2rem;
  padding-right: 2rem;
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
  height: 100vh;
  position: relative;
  // top: -10px;
`

const Background = styled.div`
`;


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

const Home: NextPage = () => {
  const [width, setWidth]   = useState<undefined|number>();
  const [height, setHeight] = useState<undefined|number>();
  const [loaded, setLoaded] = useState(false);

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
  },[])

  return (
    <PageContainer>
      <Head>
        <title>CSESoc</title>
        <meta name="description" content="CSESoc Website Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        { (loaded && height && width) && (
          <>
          {console.log(height)}
          <Background>
            {/* <CurveContainer offset={0}>
              <HomepageCurve width={400} height={height}/>
            </CurveContainer>
            <CurveContainer offset={height + 500}>
              <RectangleCurve
                height={2000}
                dontPreserveAspectRatio
              />
            </CurveContainer> */}
            <CurveContainer offset={0}>
              <Image src={HomePageCurve}/>
            </CurveContainer>
            <CurveContainer offset={height+300}>
              <Image src={TopRect}/>
              <PurpleBlock/>
              <Image src={BottomRect}/>
            </CurveContainer>
          </Background>
          <Homepage />
          <AboutUs />
          <Events />
          </>
        )}
      </main>
      <footer></footer>
    </PageContainer>
  );
};

export default Home;
