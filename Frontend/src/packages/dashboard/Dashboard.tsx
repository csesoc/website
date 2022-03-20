import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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


const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

export default function Dashboard(this: any) {
  const [modalState, setModalState] = useState<{open: boolean, type: string}>({
    open: false,
    type: "",
  });

  const [directory, setDirectory] = useState<Array<string>>(["hello", "hi"]);
  const [selectedFile, setSelectedFile] = useState<number|null>(null);
  const dispatch = useDispatch();

  const updateDirectory = (action: string) => {
    if (action == 'forward') {
      setDirectory([...directory, "hi"]);
    } else{
      setDirectory(directory.slice(0, -1));
    }
  };

  useEffect(() => {
    // fetches all folders and files from backend and displays it
    dispatch(initAction());
    // dispatch(setDirectory(
    //   {
    //     path: '',
    //     items: [],
    //   }
    // ));
  },[])

  // update the directory whenever a folder is being clicked
  useEffect(() => {
    const updateDir = async () => {
      try {
        const fileInfo: FileEntity = await API.getFolder((selectedFile != null) ? selectedFile : undefined);
        if (fileInfo.type == 'Folder') {
          setDirectory([...directory, "hi"]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    updateDir();
  }, [selectedFile])

  return (
    <Container>
      <SideBar setModalState={setModalState}/>
      <div>
        <button onClick={() => updateDirectory('backward')}>go back</button>
        <Breadcrumbs aria-label="breadcrumb">
          {
            directory.map((folder, i) => {
              return (
                <Link underline="hover" color="inherit" key={i}>
                  {folder}
                </Link>
              )
            })
          }
        </Breadcrumbs>
        <button onClick={() => updateDirectory('forward')}>forward</button>
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
