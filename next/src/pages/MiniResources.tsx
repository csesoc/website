import React from 'react'
import styled from 'styled-components'
import { GlassContainer } from '../components/eventspage/ClearLayeredGlassContainer-Styled';
import { device } from '../styles/device'
import Image from 'next/image';
import YT from '../svgs/YT.svg'
import FB from '../svgs/FB.svg'
import DC from '../svgs/DC.svg'
import SPOT from '../svgs/SPOT.svg'

import { SectionFadeInFromLeft, SectionFadeInFromRight } from "../styles/motion"

type Props = {}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30vh 0;

  @media ${device.laptop} {
    height: 100vh;
  }
`
const Heading = styled.div`
  color: var(--accent-darker-purple);
  font-family: 'Raleway';
  font-weight: 800;
  font-size: 30px;
  text-align: center;
  @media ${device.tablet} {
    font-size: 3.5vw;
  }
`

const HeadingContainer = styled.div`
  display:flex;
  justify-content: center;
`

const BodyContainer = styled.div`
  display:flex;
  padding: 10vh 20vw;

  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20vw;
  @media ${device.laptop} {
    flex-direction: row;
  }
`

const ColumnContainer = styled.div`
  display: flex; 

  flex-direction: row;
  gap: 5vw;
  justify-content: center;
  @media ${device.laptop} {
    flex-direction: column;
    gap: 10vh;
  }

`

const ImgContainer = styled.div`
  width: 50px;
  @media ${device.laptop} {
    width: 60px;
  }

  &:hover { 
		cursor: pointer;
		transform: scale(1.1);
	}
`

const imgs = [YT, FB, DC, SPOT]
const urls = ["https://www.youtube.com/c/CSESocUNSW", "https://www.facebook.com/csesoc/", "https://bit.ly/CSESocDiscord", "https://open.spotify.com/show/2h9OxTkeKNznIfNqMMYcxj"]

export default function Resources({}: Props) {
  return (
    <Container>
      <HeadingContainer>
        <Heading>Resources and Contacts</Heading>
      </HeadingContainer>
      <BodyContainer>
        <SectionFadeInFromLeft>
          <GlassContainer dark={true}/>
        </SectionFadeInFromLeft>
        <SectionFadeInFromRight>
          <ColumnContainer>
            {imgs.map((src) => (
              <ImgContainer key="imgContainer">
                <a href={urls[imgs.indexOf(src)]}>    
                  <Image src={src}/>
                </a>
            </ImgContainer>
            ))}
        </ColumnContainer>
        </SectionFadeInFromRight>
      </BodyContainer>
    </Container>
  )
}