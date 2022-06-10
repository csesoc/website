import type { NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';

import styled from "styled-components";

// local
import Homepage from "./Homepage";
import Events from './Events'
import AboutUs from './AboutUs';
import HomepageCurve from "../svgs/HomepageCurve";
import RectangleCurve from "../svgs/RectangleCurve";

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

  return (
    <PageContainer>
      <Head>
        <title>CSESoc</title>
        <meta name="description" content="CSESoc Website Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CurveContainer offset={0}>
          <HomepageCurve width={400} height={1000}/>
        </CurveContainer>
        <CurveContainer offset={1000}>
          <RectangleCurve
            height={1000}
            dontPreserveAspectRatio
          />
        </CurveContainer>
        <Homepage />
        <AboutUs />
        <Events />
      </main>
      <footer></footer>
    </PageContainer>
  );
};

export default Home;
