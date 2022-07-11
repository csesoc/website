import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Typography, TextField, Box } from '@mui/material';
import { useDispatch } from 'react-redux';

// local imports
import Button from '../../../../cse-ui-kit/buttons/Button';
import {
  addItemAction,
  AddPayloadType
} from 'src/packages/dashboard/state/folders/actions';
import { getFolderState } from "../../api/helpers";

type Props = {
  open: boolean;
  modalState: {open: boolean, type: string};
  setModalState: (flag: {open: boolean, type: string}) => void;
}

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);

  width: 500px;
  height: 200px;
  background: white;
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-gap: 20px;
`;

export default function ConfirmationWindow({open, modalState, setModalState}: Props) {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>('')
  const folderState = getFolderState();

  const handleSubmit = () => {
    switch(modalState.type) {
      case "folder": {
        const folderPayload: AddPayloadType = {
          name: inputValue,
          type: "Folder",
          parentId: folderState.parentFolder,
        }
        dispatch(addItemAction(folderPayload));
        break;
      }
      case "file": {
        const filePayload: AddPayloadType = {
          name: inputValue,
          type: "File",
          parentId: folderState.parentFolder,
        }
        dispatch(addItemAction(filePayload));
        break;
      }
    }

    setModalState({
      open: false,
      type:""
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setModalState({
          open: false,
          type:""
        });
      }}
    >
      <Container data-anchor="ConfirmationWindow">
        <Typography variant="h5">Choose your {modalState.type} name</Typography>
        <Box display="flex">
          <TextField value={inputValue} onChange={handleChange}/>
          <Button background="#73EEDC" onClick={handleSubmit}>submit</Button>
        </Box>
      </Container>
    </Modal>
  );
}
