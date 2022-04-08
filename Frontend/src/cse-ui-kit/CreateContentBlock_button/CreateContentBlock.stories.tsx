import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CreateContentBlock from './CreateContentBlock';

import { AiFillEdit } from "react-icons/ai";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'CSE-UIKIT/CreateContentBlockButton',
  component: CreateContentBlock,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof CreateContentBlock>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CreateContentBlock> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    Insert Button
    <CreateContentBlock {...args}><AiFillEdit/>Insert Content Block</CreateContentBlock>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#90c2e7",
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args