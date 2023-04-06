import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DeleteBlock from './DeleteBlock';

export default {
  title: 'CSE-UIKIT/DeleteBlockButton',
  component: DeleteBlock,

  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof DeleteBlock>;

const Template: ComponentStory<typeof DeleteBlock> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    Delete Button
    <DeleteBlock {...args}></DeleteBlock>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#FFF",
  isFocused: true
}
