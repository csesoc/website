import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

// local imports
import SideBar from 'src/components/SideBar/SideBar';
import Renderer from './components/FileRenderer/Renderer';
import { initAction } from './state/folders/actions';
import { BACKEND_URI } from 'src/config';


const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

export default function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    // fetches all folders and files from backend and displays it
    dispatch(initAction());
  },[])
  return (
    <Container>
      <SideBar />
      <Renderer />
    </Container>
  )
}
