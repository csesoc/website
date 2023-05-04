import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Typography, TextField, Box } from '@mui/material';
import { useDispatch } from 'react-redux';

// local imports
import Button from '../../../../cse-ui-kit/buttons/Button';
import {
  addItemAction,
  AddPayloadType,
  deleteFileEntityAction,
  DeletePayloadType,
} from 'src/packages/dashboard/state/folders/actions';
import { getFolderState } from '../../api/helpers';

type Props = {
  open: boolean;
  modalState: { open: boolean; selectedFile: string; type: string };
  setModalState: (flag: {
    open: boolean;
    selectedFile: string;
    type: string;
  }) => void;
};

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

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

export default function ConfirmationWindow({
  open,
  modalState,
  setModalState,
}: Props) {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>('');
  const folderState = getFolderState();

  const handleSubmit = () => {
    switch (modalState.type) {
      case 'folder': {
        const folderPayload: AddPayloadType = {
          name: inputValue,
          type: 'Folder',
          parentId: folderState.parentFolder,
        };
        dispatch(addItemAction(folderPayload));
        break;
      }
      case 'file': {
        const filePayload: AddPayloadType = {
          name: inputValue,
          type: 'File',
          parentId: folderState.parentFolder,
        };
        dispatch(addItemAction(filePayload));
        break;
      }
      case 'delete': {
        const folderPayload: DeletePayloadType = {
          id: modalState.selectedFile,
        };
        dispatch(deleteFileEntityAction(folderPayload));
        break;
      }
    }

    setModalState({
      open: false,
      selectedFile: '',
      type: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setModalState({
          open: false,
          selectedFile: '',
          type: '',
        });
      }}
    >
      {modalState.type !== 'delete' ? (
        <Container data-anchor="ConfirmationWindow">
          <Typography variant="h5">
            Choose your {modalState.type} name
          </Typography>
          <Box display="flex" alignItems="center">
            <TextField
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              sx={{ marginRight: '10px' }}
            />
            <Button background="#73EEDC" onClick={handleSubmit}>
              submit
            </Button>
          </Box>
        </Container>
      ) : (
        <Container data-anchor="ConfirmationWindow">
          <Typography variant="h5">Are you sure you want to delete?</Typography>
          <Box display="flex" alignItems="center">
            <Button background="#73EEDC" onClick={handleSubmit}>
              continue
            </Button>
          </Box>
        </Container>
      )}
    </Modal>
  );
}
