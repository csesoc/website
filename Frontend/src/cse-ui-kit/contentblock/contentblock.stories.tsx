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
    Contentblock trial
    <MoveableContentBlock {...args}>
      I think Im meant to be the children wowoowow lots of text is within this
      content block hello please expand more thank you very much yes please hehe
      heheeheheeheeheheehehehehehehe bleh i cant think of anything else to put
      in here
    </MoveableContentBlock>
  </div>
)

export const Primary = Template.bind({});