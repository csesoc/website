import React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';

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

interface SideBarButtonProps {
  bgcolor: string;
}

const SidebarButton = styled(Button) <SideBarButtonProps>`
  && {
    width: 160px;
    variant: contained;
    background-color: ${props => props.bgcolor};
    border-radius: 20px;
    text-transform: none;
  }
`

type Props = {
  setModalState: (state: {open: boolean, type: string}) => void;
  selectedFile: number | null;
}

// Wrapper component ${props => props.color}
export default function SideBar ({ setModalState, selectedFile}: Props) {

  const handleNewFile = () => {
    setModalState({
      open: true,
      type: "file"
    }); // sets modal to be open
  }

  const handleNewFolder = () => {
    setModalState({
      open: true,
      type: "folder",
    });
  }

  const navigate = useNavigate();
  const handleEdit = () => {
    if (selectedFile !== null) {
      navigate('/editor/' + selectedFile, {replace: false}), [navigate]
    }
  };

  // TODO
  const handleRecycle = () => {
    return
  }

  return (
    <Container>
      <SidebarTitle>
        Welcome \name\
      </SidebarTitle>
      <ButtonFlex>
        <ButtonGroup>
          <SidebarButton bgcolor="#F88282">
            Blog
          </SidebarButton>
          <SidebarButton bgcolor="#F88282">
            Core pages
          </SidebarButton>
        </ButtonGroup>
        <ButtonGroup>
          <SidebarButton 
            bgcolor="#82A3F8"
            onClick={handleNewFile}
            data-anchor="NewPageButton"
          >
            New page
          </SidebarButton>
          <SidebarButton
            bgcolor="#82A3F8"
            onClick={handleNewFolder}
            data-anchor="NewFolderButton"
          >
            New folder
          </SidebarButton>
        </ButtonGroup>
        <ButtonGroup>
          <SidebarButton bgcolor="#B8E8E8" onClick={handleEdit}>
              Edit
          </SidebarButton>
          <SidebarButton bgcolor="#B8E8E8">
            Feature
          </SidebarButton>
          <SidebarButton bgcolor="#B8E8E8" onClick={handleRecycle}>
            Recycle
          </SidebarButton>
        </ButtonGroup>
      </ButtonFlex>
    </Container>
  )
}

