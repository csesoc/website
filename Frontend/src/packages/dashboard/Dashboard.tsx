import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Breadcrumbs, Link } from "@mui/material";

// local imports
import SideBar from 'src/packages/dashboard/components/SideBar/SideBar';
import Renderer from './components/FileRenderer/Renderer';
import {initAction, setDirectory} from './state/folders/actions';
import ConfirmationWindow from './components/ConfirmationModal/ConfirmationWindow';
import {getFolderState} from "./api/helpers";


const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

export default function Dashboard(this: any) {
  const [modalState, setModalState] = useState<{open: boolean, type: string}>({
    open: false,
    type: "",
  });

  const [selectedFile, setSelectedFile] = useState<number|null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // fetches all folders and files from backend and displays it
    dispatch(initAction());
    dispatch(setDirectory({ parentFolder: 0, folderName: 'Home' }));
  },[]);

  return (
    <Container>
      <SideBar setModalState={setModalState}/>
      <div>
        <button>go back</button>
        <Breadcrumbs aria-label="breadcrumb">
          {
            getFolderState().path.split("/").map((folder, i) => {
              return (
                <Link underline="hover" color="inherit" key={i}>
                  {folder}
                </Link>
              )
            })
          }
        </Breadcrumbs>
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
