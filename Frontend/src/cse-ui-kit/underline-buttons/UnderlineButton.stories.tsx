import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ReactComponent as Underline } from '../../assets/underline-button.svg';
import UnderlineButton from './UnderlineButton';

export default {
  title: 'CSE-UIKIT/Underline-Button',
  component: UnderlineButton,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof UnderlineButton>;

const Template: ComponentStory<typeof UnderlineButton> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    Underline Button
    <UnderlineButton {...args}><Underline height={parseInt(args.size) * 0.6} width={parseInt(args.size) * 0.6} /></UnderlineButton>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#E2E1E7",
  size: "45px"
}