import React from "react";
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
  <div
    style={{
      margin: "30px",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      gap: "30px"
    }}
  >
    <LeftAlignButton {...{ ...args, variant: "left" }} />
    <MiddleAlignButton {...{ ...args, variant: "middle" }} />
    <RightAlignButton {...{ ...args, variant: "right" }} />
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  size: 45
}