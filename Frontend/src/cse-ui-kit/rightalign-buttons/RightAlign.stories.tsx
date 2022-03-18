import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ReactComponent as RightAlign } from '../../assets/rightalign-button.svg';
import RightAlignButton from './RightAlign';

// const stories = generateStories("Buttons");

// stories.add("Buttons", () => {
//   return (
//     <div>
//       <h1>this is a button</h1>
//       <Button/>
//     </div>
//   )
// })

export default {
  title: 'CSE-UIKIT/RightAlign-Button',
  component: RightAlignButton,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof RightAlignButton>;

const Template: ComponentStory<typeof RightAlignButton> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    RightAlign Button
    <RightAlignButton {...args}><RightAlign height={parseInt(args.size)*0.65} width={parseInt(args.size)*0.65}/></RightAlignButton>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#FFFFFF",
  size: "45px"
}