import React, { useState } from "react";
import * as PageStyle from '../components/sponsors/Sponsors-Styled';
import { content } from "../assets/sponsors.js";
import Image from "next/image";
import Dialog from '@mui/material/Dialog';
import Fade from '@mui/material/Fade';
import Footer from "../components/footer/Footer";
import Navbar from "../components/navbar/Navbar";
import { NavbarOpenHandler, NavbarType } from "../components/navbar/types";
import styled from 'styled-components'
import Link from 'next/link'
import { device } from '../styles/device'


import Otter from '../svgs/otter.png'

const Text = styled.p`
  color: white;
  padding: 3vh 0;
`

const Grid = styled.div`
  display: flex;
  justify-content: center;
  max-width: 75vw;
  margin-left: auto;
  margin-right: auto;
  background-color: #817fff;
  border-radius: 2rem;
  margin-bottom: 10vh;
  background-color: rgba(129, 127, 255, 0.75);

`

const SmallGrid = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  flex: 3;
`

const OurSponsorsCol = styled.div`
  flex: 2;
`

const SponsorCol = styled.div`
  flex: 3;

  display: flex; 
  flex-basis: calc(50% - 40px);  
  justify-content: center;
  flex-direction: column;
  padding: 8vh 0;
  // max-height: 65vh;

`

const TextContainer = styled.div`
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const ButtonContainer = styled.div`
  display: flex;
`

const H3 = styled.div`
  color: white;
  font-family: 'Raleway';
  font-weight: 800;
  font-size: 20px;
  @media ${device.tablet} {
    font-size: 2.5vw;
  }
`;


const Button = styled.button`
  background-color: white;
  margin: 10px;
  padding: 10px 45px;
  font-size: 18px;
  color: #817fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`

const ImgContainer = styled.div`

  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 30vw;

  @media ${device.laptop} {
    width: 350px;
    height: 400px;
  }

`

const HeadingContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Heading = styled.div`
  color: #A09FE3;
  font-family: 'Raleway';
  font-weight: 800;
  font-size: 30px;
  padding: 5vh 0;
  @media ${device.tablet} {
    font-size: 2.8vw;
  }
`;



export default function Sponsors2() {

  const [navbarOpen, setNavbarOpen] = useState(false);


  const handleToggle: NavbarOpenHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <div>

      <Navbar open={navbarOpen} setNavbarOpen={handleToggle} variant={NavbarType.MINIPAGE} />

      <HeadingContainer>
        <Heading>Support CSESoc</Heading>
      </HeadingContainer>
      <ImgContainer>
        <Image src={Otter} />
      </ImgContainer>

      <Grid>
        
        <OurSponsorsCol>
          <TextContainer>
            <H3>Our Sponsors</H3>
            <Text>Check out our very cool sponsors</Text>
            <ButtonContainer>
              <Link href="/Sponsors">
                <Button>View our sponsors</Button>
              </Link>
            </ButtonContainer>
          </TextContainer>
          </OurSponsorsCol>
          <SmallGrid>
            <SponsorCol>
              <Image
                src={`/assets/sponsors/atl.webp`}
                width={100}
                height={30}
                objectFit="contain"
                // style={{filter: invert(1)}}
              />
            </SponsorCol>
            <SponsorCol>
              <Image
                  src={`/assets/sponsors/goog.webp`}
                  width={60}
                  height={60}
                  objectFit="contain"
                />
            </SponsorCol>
         
            <SponsorCol>
            <Image
                src={`/assets/sponsors/fl.webp`}
                width={200}
                height={80}
                objectFit="cover"
              />
            </SponsorCol>
            <SponsorCol>
            <Image
                src={`/assets/sponsors/msft.webp`}
                width={100}
                height={50}
                objectFit="contain"
              />
            </SponsorCol>
          </SmallGrid>
        

      </Grid>

      <Footer />
    </div>
  );

}