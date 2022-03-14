import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ReactComponent as Underline } from '../../assets/underline-button.svg';
import UnderlineButton from './UnderlineButton';

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
    <UnderlineButton {...args}><Underline height={parseInt(args.size)*0.55} width={parseInt(args.size)*0.55}/></UnderlineButton>
  </div>
)

export const Primary = Template.bind({});
Primary.args = {
  background: "#E2E1E7",
  size: "45px"
}