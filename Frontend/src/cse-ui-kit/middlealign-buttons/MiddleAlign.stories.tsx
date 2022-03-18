import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ReactComponent as MiddleAlign } from '../../assets/middlealign-button.svg';
import MiddleAlignButton from './MiddleAlign';

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
  title: 'CSE-UIKIT/MiddleAlign-Button',
  component: MiddleAlignButton,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof MiddleAlignButton>;

const Template: ComponentStory<typeof MiddleAlignButton> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    MiddleAlign Button
    <MiddleAlignButton {...args}><MiddleAlign height={parseInt(args.size)*0.65} width={parseInt(args.size)*0.65}/></MiddleAlignButton>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#2B3648",
  size: "45px",
  corner: "3px"
}