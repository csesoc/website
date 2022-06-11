import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CreateHeadingBlock from './CreateHeadingBlock';

import { AiFillEdit } from "react-icons/ai";

export default {
  title: 'CSE-UIKIT/CreateTitleBlockButton',
  component: CreateHeadingBlock,

  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof CreateHeadingBlock>;

const Template: ComponentStory<typeof CreateHeadingBlock> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    Insert Button
    <CreateHeadingBlock {...args}></CreateHeadingBlock>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#90c2e7",
}
