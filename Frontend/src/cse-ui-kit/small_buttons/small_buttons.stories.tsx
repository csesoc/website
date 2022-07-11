import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import BoldButton from './BoldButton';
import ItalicButton from './ItalicButton';
import UnderlineButton from './UnderlineButton';
import { Box } from "@mui/material";

// More on flexDirection type casting: https://stackoverflow.com/questions/62432985/typescript-saying-a-string-is-invalid-even-though-its-in-the-union
const BoxContainerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center"
}

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
    <Box {...BoxContainerStyle}>
      Bold Button
      <BoldButton {...args} />
    </Box>

    <Box {...BoxContainerStyle}>
      Italic Button
      <ItalicButton {...args} />
    </Box>

    <Box {...BoxContainerStyle}>
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