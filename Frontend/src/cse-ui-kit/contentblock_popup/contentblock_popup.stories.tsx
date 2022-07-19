import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import ContentBlockPopup from './contentblock_popup';

export default {
  title: 'CSE-UIKIT/UploadContentPopup',
  component: ContentBlockPopup,
} as ComponentMeta<typeof ContentBlockPopup>;


function Func() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          invisible: true,
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div>
            <ContentBlockPopup />
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

const Template: ComponentStory<typeof ContentBlockPopup> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    UploadContentPopup
    <Func />
  </div>
)

export const Primary = Template.bind({});