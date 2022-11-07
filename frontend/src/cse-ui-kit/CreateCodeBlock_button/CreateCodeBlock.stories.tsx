import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CreateCodeBlock from './CreateCodeBlock';

export default {
  title: 'CSE-UIKIT/CreateCodeBlockButton',
  component: CreateCodeBlock,

  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof CreateCodeBlock>;

const Template: ComponentStory<typeof CreateCodeBlock> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    Insert Button
    <CreateCodeBlock {...args}></CreateCodeBlock>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#90c2e7",
}
