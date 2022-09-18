import React from 'react'
import styled from 'styled-components'
import Otter from '../svgs/otter.png'
import Image from 'next/image';
import Link from 'next/link'
import { device } from '../styles/device'

type Props = {}

const Container = styled.div`
  @media ${device.laptop} {
    height: 100vh;
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
  width: 1500px;
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

const Button = styled.button`
  background-color:  #9B9B9B;
  margin: 10px;
  padding: 10px 45px;
  font-size: 18px;
  color: white;
  border: none;
  border-radius: 6px;

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
              <Button>View our sponsors</Button>
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