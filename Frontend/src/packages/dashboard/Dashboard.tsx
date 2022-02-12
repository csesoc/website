import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

// local imports
import SideBar from 'src/packages/dashboard/components/SideBar/SideBar';
import Renderer from './components/FileRenderer/Renderer';
import { initAction } from './state/folders/actions';
import ConfirmationWindow from './components/ConfirmationModal/ConfirmationWindow';
import { Folder, File } from './state/folders/types';


const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

export default function Dashboard() {
  const [modalState, setModalState] = useState<{open: boolean, type: string}>({
    open: false,
    type: "",
  });
  const [selectedFile, setSelectedFile] = useState<number|null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    // fetches all folders and files from backend and displays it
    dispatch(initAction());
  },[])

  return (
    <Container>
      <SideBar setModalState={setModalState}/>
      <div>
        <button>go back</button>
      </div>
      <Renderer 
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
      <ConfirmationWindow 
        open={modalState.open}
        modalState={modalState}
        setModalState={setModalState}
      />
    </Container>
  )
}
