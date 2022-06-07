import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MediaContentBlock from './media_content_block';

export default {
  title: 'CSE-UIKIT/MediaContentBlock',
  component: MediaContentBlock,

  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof MediaContentBlock>;

const Template: ComponentStory<typeof MediaContentBlock> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    Insert Media Content Block
    <MediaContentBlock {...args}></MediaContentBlock>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#90c2e7",
}