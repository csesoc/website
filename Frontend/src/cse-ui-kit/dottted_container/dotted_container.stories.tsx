import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DottedContainer from './dotted_container';

export default {
  title: 'CSE-UIKIT/DottedContainer',
  component: DottedContainer,

} as ComponentMeta<typeof DottedContainer>;

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