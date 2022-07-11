import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from './Button';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'CSE-UIKIT/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    Basic Button
    <Button {...args}>Click me</Button>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#90c2e7",
}

export const Secondary = Template.bind({});
Secondary.args = {
  background: "#a799b7"
}
// More on args: https://storybook.js.org/docs/react/writing-stories/args
