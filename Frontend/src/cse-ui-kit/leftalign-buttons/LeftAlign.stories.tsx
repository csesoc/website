import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ReactComponent as LeftAlign } from '../../assets/leftalign-button.svg';
import LeftAlignButton from './LeftAlign';

export default {
  title: 'CSE-UIKIT/LeftAlign-Button',
  component: LeftAlignButton,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof LeftAlignButton>;

const Template: ComponentStory<typeof LeftAlignButton> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    LeftAlign Button
    <LeftAlignButton {...args}><LeftAlign height={parseInt(args.size) * 0.65} width={parseInt(args.size) * 0.65} /></LeftAlignButton>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#FFFFFF",
  size: "45px"
}