import React from "react";
import { Box } from "@mui/material";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import LeftAlignButton from './LeftAlign';
import MiddleAlignButton from './MiddleAlign';
import RightAlignButton from './RightAlign';

const BoxContainerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center"
}

export default {
  title: 'CSE-UIKIT/TextAlignButtons',
  component: LeftAlignButton,
} as ComponentMeta<typeof LeftAlignButton>;

const Template: ComponentStory<typeof LeftAlignButton> = (args) =>
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
      Left Alignment Button
      <LeftAlignButton {...args} />
    </Box>

    <Box {...BoxContainerStyle}>
      Middle Alignment Button
      <MiddleAlignButton {...{ ...args, variant: "middle" }} />
    </Box>

    <Box {...BoxContainerStyle}>
      Right Alignment Button
      <RightAlignButton {...args} />
    </Box>

  </Box>
)

export const Primary = Template.bind({});
Primary.args = {
  size: 45
}