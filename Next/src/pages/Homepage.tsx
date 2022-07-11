import React from 'react'
import styled from "styled-components";
import Image from 'next/image';

type Props = {}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-gap: 20vw;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ImageContainer = styled.div`
  position: relative; /* IMPORTANT */
  width: 550px;
  height: 400px;
  margin-left: 100px;
  display: flex;
  align-items: center;
`

const Text1 = styled.p`
  color: #010033;
  font-size: 36px;
  padding: 10px 0;
  margin-top: 100px;
`;

const Text2 = styled.p`
  color: #3977F8;
  font-size: 36px;
`;

const Text3 = styled.p`
  color: #010033;
  font-style: italic;
  font-size: 36px;
  display:inline;
`;

const Scroll = styled.p`
  transform: rotate(90deg);
  position: absolute;
  right: 0px;
  bottom: 0px;
`;


export default function Homepage({}: Props) {
  return (
    <>
      <Container>
        <ColumnContainer>
          <Image src="/assets/logo.svg" width="362" height="84" />
          <Text1>
            Empowering
            <Text3> future</Text3>
            <Text2>Technological Leaders</Text2>
          </Text1>
        </ColumnContainer>
        {/* <Button>Visit on Blog</Button> */}
        <ImageContainer>
          <Image src="/assets/WebsitesIcon.png" layout="fill" objectFit="contain" />
        </ImageContainer>
        <Scroll>Scroll down &gt;&gt;</Scroll>
      </Container>
      
    </>
  )
}
