import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import HomepageIcon from "../components/assets/HomepageIcon";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-left: 2rem;
  padding-right: 2rem;
`;

const ImageContainer = styled.div`
  position: absolute;
  left: 10%;
  top: 25%;
  justify-content: flex-end;
`;

const Subtitle = styled.span`
  color: #010033;
  font-size: 36px;
  padding: 10px 0;
  text-shadow: 0px 4px 4px;
  margin-top: 100px;
`;

const Coloured = styled.span`
  color: #3977f8;
`;

const Italic = styled.span`
  font-style: italic;
`;

const Button = styled.button`
  background-color: #ffffff;
  color: #3977f8;
  font-size: 22px;
  margin-top: 150px;
  padding: 0.25em 1em;
  border: 1px solid #3977f8;
  border-radius: 3px;
  position: absolute;
  width: 184px;
  height: 44px;
`;

const Home: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>CSESoc</title>
        <meta name="description" content="CSESoc Website Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <HomepageIcon />
        <ImageContainer>
          <Image src="/logo.svg" width="362" height="84" alt="csesoc logo" />
          <div>
            <Subtitle>
              Empowering
              <Italic> future</Italic>
              <br />
              <Coloured>Technological Leaders</Coloured>
            </Subtitle>
          </div>
          <Button>Visit on Blog</Button>
        </ImageContainer>
      </main>

      <footer></footer>
    </PageContainer>
  );
};

export default Home;
