import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import BoldButton from './BoldButton';
import ItalicButton from './ItalicButton';
import UnderlineButton from './UnderlineButton';
import { Box } from "@mui/material";

export default {
  title: 'CSE-UIKIT/SmallButtons',
  component: BoldButton,
} as ComponentMeta<typeof BoldButton>;

const Template: ComponentStory<typeof BoldButton> = (args) =>
(
  <Box
    margin="30px"
    display="flex"
    flexDirection="row"
    flexWrap="wrap"
    justifyContent="flex-start"
    gap="30px"
  >
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      Bold Button
      <BoldButton {...args} />
    </Box>

    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      Italic Button
      <ItalicButton {...args} />
    </Box>

    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      Underline Button
      <UnderlineButton {...args} />
    </Box>
  </Box>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#E2E1E7",
  size: 45
}