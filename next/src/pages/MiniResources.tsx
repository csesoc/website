import React from 'react'
import styled from 'styled-components'


type Props = {}

const Container = styled.div`
  height: 100vh;
  margin: 30vh 0;
`
const Heading = styled.div`
  color: white;
  font-family: 'Raleway';
  font-weight: 800;
  font-size: 3.5vw;
`

const HeadingContainer = styled.div`
  display:flex;
  justify-content: center;
`

const BodyContainer = styled.div`
  display:flex;
  padding: 10vh 20vw;
`
const ClearBoxPlaceholder = styled.div`
  height: 40vh;
  width: 30vw;
  background: white;
`


export default function Resources({}: Props) {
  return (
    <Container>
      <HeadingContainer>
        <Heading>Resources and Contacts</Heading>
      </HeadingContainer>
      <BodyContainer>
        <ClearBoxPlaceholder/>
      </BodyContainer>
    </Container>
  )
}