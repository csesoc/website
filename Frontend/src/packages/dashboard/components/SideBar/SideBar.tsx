import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import {
  addFolderItemAction,
  addFileItemAction 
} from 'src/packages/dashboard/state/folders/actions';
import { Folder, File } from 'src/packages/dashboard/state/folders/types';

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
const newFile: File = {
  id: 1,
  name: "hi",
  type: "File",
}

const newFolder: Folder = {
  id: 999,
  name: "hi",
  type: "Folder",
}


// Wrapper component ${props => props.color}
export default function SideBar () {
  const dispatch = useDispatch();
  // TODO
  const handleNewFile = () => {
    dispatch(addFileItemAction(newFile))
  }

  const handleNewFolder = () => {
    dispatch(addFolderItemAction(newFolder))
  }

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
          <SidebarButton bgColor="#F88282">
            Blog
          </SidebarButton>
          <SidebarButton bgColor="#F88282">
            Core pages
          </SidebarButton>
        </ButtonGroup>
        <ButtonGroup>
          <SidebarButton bgColor="#82A3F8" onClick={handleNewFile}>
            New page
          </SidebarButton>
          <SidebarButton bgColor="#82A3F8" onClick={handleNewFolder}>
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
          <SidebarButton bgColor="#B8E8E8" onClick={handleRecycle}>
            Recycle
          </SidebarButton>
        </ButtonGroup>
      </ButtonFlex>
    </Container>
  )
}

