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
    padding-left: 5vw;
  }

  @media ${device.desktop} {
    padding: 0 10vw;
  }


`;

const ImageContainer = styled.div`


	position: relative; /* IMPORTANT */
  width: 70vw;

  @media ${device.laptop} {
    width: 550px;
    height: 400px;
    margin-left: 100px;
    display: flex;
    align-items: center;
  }

`;

const Text1 = styled.p`
	padding: 10px 0;
	margin-top: 100px;
	color: #010033;
	font-size: 25px;
  display: flex;
  gap: 1vw;
  @media ${device.tablet} {
    font-size: 36px;
  }
`;

const Text2 = styled.p`
	color: #3977f8;
	font-size: 25px;
  @media ${device.tablet} {
    font-size: 36px;
  }
`;

const Text3 = styled.p`
	color: #010033;
	font-style: italic;
	font-size: 25px;
	display: inline;
  @media ${device.tablet} {
    font-size: 36px;
  }
`;

const Scroll = styled.p`
	transform: rotate(90deg);
	position: absolute;
	right: 0px;
	bottom: 10%;
`;

export default function Homepage({}: Props) {
  return (
    <>
      <HomepageContainer>
        <Container>
          <ColumnContainer>
            <FadeIn>
              <ImageContainer>
                <Image src="/assets/logo.svg" width="600px" height="300px"/>
              </ImageContainer>
            </FadeIn>
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
          </ColumnContainer>
          {/* <Button>Visit on Blog</Button> */}
          <SlideInFromRight>
            <ImageContainer>
              <Image src="/assets/WebsitesIcon.png" layout="fill" objectFit="contain" />
            </ImageContainer>
          </SlideInFromRight>
        </Container>
      </HomepageContainer>
    </>
  )
}
