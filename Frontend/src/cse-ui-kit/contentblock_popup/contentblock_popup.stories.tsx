import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ContentBlockPopup from './contentblock_popup';

export default {
  title: 'CSE-UIKIT/UploadContentPopup',
  component: ContentBlockPopup,
} as ComponentMeta<typeof ContentBlockPopup>;

const Template: ComponentStory<typeof ContentBlockPopup> = (args) =>
(
  <div
    style={{
      margin: "30px"
    }}
  >
    UploadContentPopup
    <ContentBlockPopup />
  </div>
)

export const Primary = Template.bind({});