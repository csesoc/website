import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Container from './container';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'CSE-UIKIT/Container',
  component: Container,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Container>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Container> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    <Container {...args}></Container>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#90c2e7",
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args