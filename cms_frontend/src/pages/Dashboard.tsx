import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Dialog, DialogContent, IconButton } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import SideBar from 'src/components/SideBar/SideBar';
import FileRenderer from 'src/components/FileRenderer/FileRenderer';
import NewDialogue from 'src/components/NewDialogue/NewDialogue';

import Files from "src/data/dummy_structure.json";
type FolderName = keyof typeof Files;

// Heading to display current directory, separated out to avoid inline styling
const Directory = styled.h3`
  display: inline-block;
  margin-left: 20px;
  margin-right: 10px;
`;

const Dashboard: React.FC = () => {
  const [dir, setDir] = useState("root" as FolderName);

  // Modal state handler
  const [open, setOpen] = React.useState(false);

  // Modal opener
  const handleOpen = () => {
    setOpen(true);
  }

  // Modal closer
  const handleClose = () => {
    setOpen(false);
  }

  // Gets the parent directory of our current directory, does not check
  // if that directory exists
  const getParent = () => {
    return dir.split("/").slice(0, -1).join("/");
  }

  // Moves our current directory up (analogous to `cd ..`)
  const toParent = () => {
    const parent = getParent() as FolderName;
    setDir(parent);
  }

  // Checks if our current directory has a parent directory
  const hasParent = () => {
    const parent = getParent();

    for (const key in Files) {
      if (parent === key) {
        return true;
      }
    }

    return false;
  }

  const fileClick = (name: string) => {
    // TODO: fill with API call
  }

  const folderClick = (name: string) => {
    const childName = `${dir}/${name}` as FolderName;
    setDir(childName);
  }

  const newFile = () => {
    // TODO: fill with API call
  }

  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div style={{ flex: 1 }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <NewDialogue directory = {dir} isCore = {false}/>
        </DialogContent>
      </Dialog>
        <Directory>{dir}</Directory>
        <IconButton
          disabled={!hasParent()}
          onClick={() => toParent()}
          style={{ display: "inline-block", border: "1px solid grey" }}>
          <ExpandLessIcon />
        </IconButton>
        <FileRenderer
          files={Files[dir]}
          onFileClick={fileClick}
          onFolderClick={folderClick}
          onNewFile={handleOpen} />
      </div>
      <Button> </Button>
    </div>
  )
};

export default Dashboard;
