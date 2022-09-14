import React from 'react'
import styled from 'styled-components'
import Otter from '../svgs/otter.png'
import Image from 'next/image';
import Link from 'next/link'
import { device } from '../styles/device'

type Props = {}

const Container = styled.div`
  height: 100vh;
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
  @media ${device.tablet} {
    font-size: 3.5vw;
  }
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10vh 0;
  @media ${device.tablet} {
    flex-direction: row;
    padding: 10vh 30vw;
  }
`

const TextContainer = styled.div`
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const H3 = styled.div`
  color: #9B9B9B;
  font-family: 'Raleway';
  font-weight: 800;
  font-size: 20px;
  @media ${device.tablet} {
    font-size: 2.5vw;
  }
`;

const Text = styled.p`
  color: #9B9B9B;
`

const ButtonContainer = styled.div`
  display: flex;
`

const ImgContainer = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
`


export default function Support({}: Props) {
  return (
    <Container>
      <HeadingContainer>
        <Heading>Support CSESoc</Heading>
      </HeadingContainer>
      <BodyContainer>
        <TextContainer>
          <H3>Our Sponsors</H3>
          <ButtonContainer>
            <Link href="/sponsors">
              <button>view our sponsors</button>
            </Link>
          </ButtonContainer>
          <Text>Check out our very cool sponsors</Text>
        </TextContainer>
        <ImgContainer>
          <Image src={Otter}/>
        </ImgContainer>
      </BodyContainer>
    </Container>
  )
}