import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import HomepageIcon from './assets/HomepageIcon';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-left: 2rem;
  padding-right: 2rem;
`;

const Home: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>CSESoc</title>
        <meta name="description" content="CSESoc Website Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomepageIcon />
      <main>Empowering future Technological Leader</main>

      <footer></footer>
    </PageContainer>
  );
};

export default Home;
