import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MoveableCodeContentContentBlock from './mediacontentblock-wrapper';

export default {
  title: 'CSE-UIKIT/CodeContentContentBlock',
  component: MoveableCodeContentContentBlock,
} as ComponentMeta<typeof MoveableCodeContentContentBlock>;

const Template: ComponentStory<typeof MoveableCodeContentContentBlock> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    Moveable Content Block
    <MoveableCodeContentContentBlock {...args}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </MoveableCodeContentContentBlock>
  </div>
)

export const Primary = Template.bind({});