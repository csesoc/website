// flex-row
// each icon (wrapper)

import type { NextPage } from "next";

import Image from 'next/image';
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 22vh;
`;

const ImageContainer = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Raleway:300,400,700&display=swap');
  position: absolute;
  font-family: "Raleway", sans-serif;
  display: flex;
  flex-direction: column;
  max-width: 50vw;
`;

const GridContainer = styled.div`
  background-image: url('/assets/rectangle26.svg');
  background-size: cover;

  display: inline-grid;
  position: relative;
  grid-template-rows: 50% 50%;
  grid-template-columns: 40% 30% 30%;
  grid-template-areas:
      "sidebar content content"
      "sidebar content1 content1";
  text-align: center;
  border-radius: 40px;
`;

const SideBar = styled.div`
  grid-area: sidebar;
  padding: 5px;
  margin: 15px;
`;

const ContentBox = styled.div`
  display: flex;
  align-items: center;
  grid-area: content;
  margin: 0px;
`;
const Content1 = styled.div`
  opacity: 0.9;
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: block;
  justify-content: space-between;
  row-gap: 0;
`;
const Content2 = styled(Content1)`
  border-top-right-radius:40px;
`
const Content3 = styled(Content1)`
  border-bottom-right-radius: 40px;
`;

const ContentBox1 = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  align-items: center;
  grid-area: content1;
  justify-content: center;
`;
const Footer = styled.footer`
  background: #5282FF;
  padding: 0.25rem;
  display: inline-grid;
  text-align: right;
  margin-top: 2rem;
`;

const Title = styled.h1`
  font-family: "Raleway", sans-serif;
  color: #A09FE3;
  font-size: 64px;
  text-align: center;
`

const Text1 = styled.h1`
  color: #FFFFFF;
  font-size: 36px;
  padding: 10px 0;
`;

const Text2 = styled.body`
  color: #FFFFFF;
  font-size: 16px;
`;

const Text3 = styled.body`
  color: #FFFFFF;
  font-size: 12px;
  display: block;
`;

const Button = styled.button`
  background-color:#FFFFFF;
  color: #3977F8;
  font-size: 16px;
  padding: 0.9em;
  border: 1px solid;
  border-radius: 10px;
  position: relative;
  margin: 15%;
  width: 75%;
`;

const ImageStyled = styled.img`
  position: absolute;
  bottom: 0;
`

const Support: NextPage = () => {
  return (
    <PageContainer>
        <ImageContainer>
          <Title>Support CSESoc</Title>
          <Image src="/assets/otter.svg" width={300} height={300}/>
          <GridContainer>
              <SideBar>
                  <Text1>Our Sponsors</Text1>
                  <Text2>Check out our very cool </Text2>
                  <Text2>sponsors dodadada</Text2>
                  <Button>View Our Sponsors</Button>
              </SideBar>
              <ContentBox>
                  <Content1><Image src="/assets/Atlassian.svg" width={270} height={150}/></Content1>
                  <Content2><Image src="/assets/Freelancer.svg" width={270} height={150}/></Content2>
              </ContentBox>
              <ContentBox1>
                  <Content1><Image src="/assets/Google.svg" width={270} height={150}/></Content1>
                  <Content3><Image src="/assets/Microsoft.svg" width={270} height={150}/></Content3>
              </ContentBox1>
          </GridContainer>
          <Footer>
            <ImageStyled src="/assets/CSESoc logo.svg" width={270} height={52.58}/>
            <Text3>B03 CSE Building K17, UNSW</Text3>
            <Text3>csesoc@csesoc.org.au</Text3>
            <Text3>© 2021 — CSESoc UNSW</Text3>
          </Footer>
        </ImageContainer>
    </PageContainer>
  );
};

export default Support;