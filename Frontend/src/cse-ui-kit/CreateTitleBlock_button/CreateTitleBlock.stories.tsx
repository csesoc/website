import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CreateTitleBlock from './CreateTitleBlock';

import { AiFillEdit } from "react-icons/ai";

export default {
  title: 'CSE-UIKIT/CreateTitleBlockButton',
  component: CreateTitleBlock,

  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof CreateTitleBlock>;

const Template: ComponentStory<typeof CreateTitleBlock> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    Insert Button
    <CreateTitleBlock {...args}></CreateTitleBlock>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#90c2e7",
}
