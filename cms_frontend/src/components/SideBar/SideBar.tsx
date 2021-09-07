import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const Container = styled.div`
  width: 250px;
  background: lightgrey;
  height: 100vh;
`
const SidebarTitle = styled.div`
  font-size: xx-large;
  margin: 2rem;
  font-weight: bold;
`
const ButtonFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 80px;
`
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-gap: 30px;
`

interface SidebarProps {
  bgColor: string;
}

const SidebarButton = styled(Button)<SidebarProps>`
  && {
    width: 160px;
    variant: contained;
    background-color: ${props => props.bgColor};
    border-radius: 20px;
    text-transform: none;
  }
`

// Wrapper component ${props => props.color}
const SideBar: React.FC = () => {
  return (
    <Container>
      <SidebarTitle>
        Welcome "name"
      </SidebarTitle>
      <ButtonFlex>
          <ButtonGroup>
          <SidebarButton bgColor="#F88282">
            Blog
          </SidebarButton>
          <SidebarButton bgColor="#F88282">
            Core pages
          </SidebarButton>
          </ButtonGroup>
          <ButtonGroup>
          <SidebarButton bgColor="#82A3F8">
            New page
          </SidebarButton>
          <SidebarButton bgColor="#82A3F8">
            New folder
          </SidebarButton>
          </ButtonGroup>
          <ButtonGroup>
          <SidebarButton bgColor="#B8E8E8">
            Edit
          </SidebarButton>
          <SidebarButton bgColor="#B8E8E8"> 
            Feature
          </SidebarButton>
          <SidebarButton bgColor="#B8E8E8">
            Recycle
          </SidebarButton>
          </ButtonGroup>
      </ButtonFlex>
    </Container>
  )
}

export default SideBar
