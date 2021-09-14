import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const Container = styled.div`
  width: 250px;
  background: lightgrey;
  height: 100%;
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

interface SideBarProps {
  onNewFile: () => void,
  onNewFolder: () => void
}

interface SideBarButtonProps {
  bgColor: string;
}

const SidebarButton = styled(Button) <SideBarButtonProps>`
  && {
    width: 160px;
    variant: contained;
    background-color: ${props => props.bgColor};
    border-radius: 20px;
    text-transform: none;
  }
`

interface SideBarProps {
  onNewFolder: () => void;
}

// Wrapper component ${props => props.color}
const SideBar: React.FC<SideBarProps> = ({ onNewFile, onNewFolder }) => {
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
          <SidebarButton bgColor="#82A3F8" onClick={onNewFile}>
            New page
          </SidebarButton>
          <SidebarButton bgColor="#82A3F8" onClick={onNewFolder}>
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

export default SideBar;
