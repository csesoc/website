import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CreateContentBlock from './CreateContentBlock';

import { AiFillEdit } from "react-icons/ai";

export default {
  title: 'CSE-UIKIT/CreateContentBlockButton',
  component: CreateContentBlock,

  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof CreateContentBlock>;

const Template: ComponentStory<typeof CreateContentBlock> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    Insert Button
    <CreateContentBlock {...args}></CreateContentBlock>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#90c2e7",
}
