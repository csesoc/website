import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import Events from './Events'
import Homepage from "./Homepage";
import Contact from "./contact";
import Support from "./support";
import AboutUs from './AboutUs';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-left: 2rem;
  padding-right: 2rem;
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
        <Homepage/>
        <AboutUs />
        <Events />
        <Contact/>
        <Support/>
      </main>
      <footer></footer>
    </PageContainer>
  );
};

export default Home;
