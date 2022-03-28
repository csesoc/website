import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import BoldButton from './BoldButton';
import ItalicButton from './ItalicButton';
import UnderlineButton from './UnderlineButton';

export default {
  title: 'CSE-UIKIT/SmallButtons',
  component: BoldButton,
} as ComponentMeta<typeof BoldButton>;

const Template: ComponentStory<typeof BoldButton> = (args) =>
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
    <BoldButton {...args} />

    <ItalicButton {...args} />

    <UnderlineButton {...args} />
  </div >
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#E2E1E7",
  size: 45
}