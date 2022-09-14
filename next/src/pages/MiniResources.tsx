import React from 'react'
import styled from 'styled-components'
import { GlassContainer } from '../components/eventspage/ClearLayeredGlassContainer-Styled';
import { device } from '../styles/device'

type Props = {}

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30vh 0;
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
`

export default function Resources({}: Props) {
  return (
    <Container>
      <HeadingContainer>
        <Heading>Resources and Contacts</Heading>
      </HeadingContainer>
      <BodyContainer>
        <GlassContainer dark={true}/>
      </BodyContainer>
    </Container>
  )
}