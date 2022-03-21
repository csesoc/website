import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { call } from 'redux-saga/effects';
import styled from 'styled-components';
import { Breadcrumbs, Link } from "@mui/material";

// local imports
import SideBar from 'src/packages/dashboard/components/SideBar/SideBar';
import Renderer from './components/FileRenderer/Renderer';
import {initAction, setDirectory} from './state/folders/actions';
import ConfirmationWindow from './components/ConfirmationModal/ConfirmationWindow';
import {Folder, File, FileEntity} from './state/folders/types';
import * as API from './api/index';
import {RootState} from "../../redux-state/reducers";
import {folderSelectors} from "./state/folders";


const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

export default function Dashboard(this: any) {
  const [modalState, setModalState] = useState<{open: boolean, type: string}>({
    open: false,
    type: "",
  });

  // const [dir, setDir] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<number|null>(null);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const folders = useSelector((state: RootState) => (
  //     folderSelectors.getFolderState(state)
  //   ));
  //   setDir(folders.path);
  // });

  useEffect(() => {
    // fetches all folders and files from backend and displays it
    dispatch(initAction());
    dispatch(setDirectory('/Home'));
  },[]);

  return (
    <Container>
      <SideBar setModalState={setModalState}/>
      <div>
        <button>go back</button>
        <Breadcrumbs aria-label="breadcrumb">
          {
            useSelector((state: RootState) => (
              folderSelectors.getFolderState(state)
            )).path.split("/").map((folder, i) => {
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
