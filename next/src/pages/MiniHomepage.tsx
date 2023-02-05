import React from "react"
import styled from "styled-components";
import Image from 'next/image';
import Navbar from "../components/navbar/Navbar";
import { NavbarOpenHandler } from "../components/navbar/types";
import HamburgerMenu from "../components/navbar/HamburgerMenu";
import { device } from "../styles/device"
import { useState } from "react";


import { FadeIn, SlideInFromRight, TypewriterAnimation } from '../styles/motion'

type Props = {};

const HomepageContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
  @media ${device.laptop} {
    height: 100vh;
  }
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media ${device.laptop} {
    flex-direction: row;
  }
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media ${device.laptop} {
    padding: 0 10vw;
    max-width: 55vw;
  }

`;

const ImageContainer = styled.div`
	position: relative; /* IMPORTANT */
  width: 50vw;
  height: 20vh;


  @media ${device.laptop} {
    width: 550px;
    height: 400px;
    display: flex;
  }

`;

const WebsiteImageContainer = styled.div`

	position: relative; /* IMPORTANT */
  width: 500px;

  @media ${device.laptop} {
    width: 550px;
    height: 400px;
    margin-left: 100px;
    margin-top: 30vh;
    display: flex;
  }

`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media ${device.tablet} {
    gap: 10px;
  }
`

const Text1 = styled.div`
	color: #010033;
	font-size: 25px;
  display: flex;
  gap: 1vw; /* gives it space */
  @media ${device.tablet} {
    font-size: 36px;
  }
`;

const Text2 = styled.div`
	color: #3977f8;
	font-size: 25px;
  @media ${device.tablet} {
    font-size: 36px;
  }
`;

const Text3 = styled.div`
	color: #010033;
	font-style: italic;
	font-size: 25px;
	display: inline;
  @media ${device.tablet} {
    font-size: 36px;
  }
`;

export default function Homepage({ }: Props) {
  return (
    <>
      <HomepageContainer>
        <Container>
          <ColumnContainer>
            <FadeIn>
              <ImageContainer>
                <Image src="/assets/logo.svg" width="600px" height="300px" />
              </ImageContainer>
            </FadeIn>
            <TextContainer>
              <Text1>
                <Text3>
                  <TypewriterAnimation>
                    Empowering
                  </TypewriterAnimation>
                </Text3>
                <Text3>
                  <TypewriterAnimation>
                    future
                  </TypewriterAnimation>
                </Text3>
              </Text1>
              <Text2>
                <TypewriterAnimation>
                  Technological Leaders
                </TypewriterAnimation>
              </Text2>
            </TextContainer>
          </ColumnContainer>
          {/* <Button>Visit on Blog</Button> */}
          <SlideInFromRight>
            <WebsiteImageContainer>
              <Image src="/assets/WebsitesIcon.png" layout="fill" objectFit="contain" />
            </WebsiteImageContainer>
          </SlideInFromRight>
        </Container>
      </HomepageContainer>
    </>
  )
}
