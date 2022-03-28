import React from "react";
import { Box } from "@mui/material";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import LeftAlignButton from './LeftAlign';
import MiddleAlignButton from './MiddleAlign';
import RightAlignButton from './RightAlign';

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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      Left Alignment Button
      <LeftAlignButton {...args} />
    </Box>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      Middle Alignment Button
      <MiddleAlignButton {...{ ...args, variant: "middle" }} />
    </Box>

    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      Right Alignment Button
      <RightAlignButton {...args} />
    </Box>

  </Box>
)

export const Primary = Template.bind({});
Primary.args = {
  size: 45
}