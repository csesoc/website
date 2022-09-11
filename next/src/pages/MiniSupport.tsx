import React from 'react'
import styled from 'styled-components'
import Otter from '../svgs/otter.png'
import Image from 'next/image';
import Link from 'next/link'

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
  font-size: 3.5vw;
`;

const BodyContainer = styled.div`
  display: flex;
  padding: 10vh 30vw;
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
  font-size: 2.5vw;
`;

const Text = styled.p`
  color: #9B9B9B;
`

const ButtonContainer = styled.div`
  display: flex;
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
        <Image src={Otter}/>
      </BodyContainer>
    </Container>
  )
}