import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ReactComponent as Bold } from '../../assets/bold-button.svg';
import BoldButton from './BoldButton';

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
  title: 'CSE-UIKIT/Bold-Button',
  component: BoldButton,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof BoldButton>;

const Template: ComponentStory<typeof BoldButton> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    Bold Button
    <BoldButton {...args}><Bold height={parseInt(args.size)*0.55} width={parseInt(args.size)*0.55}/></BoldButton>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#E2E1E7",
  size: "45px"
}