import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MoveableContentBlock from './contentblock-wrapper';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'CSE-UIKIT/ContentBlock',
  component: MoveableContentBlock,
} as ComponentMeta<typeof MoveableContentBlock>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MoveableContentBlock> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    Moveable Content Block
    <MoveableContentBlock {...args}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </MoveableContentBlock>
  </div>
)

export const Primary = Template.bind({});