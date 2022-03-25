import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DottedContainer from './dotted_container';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'CSE-UIKIT/DottedContainer',
  component: DottedContainer,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof DottedContainer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DottedContainer> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    <DottedContainer {...args}></DottedContainer>
  </div>
)
export const Primary = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args