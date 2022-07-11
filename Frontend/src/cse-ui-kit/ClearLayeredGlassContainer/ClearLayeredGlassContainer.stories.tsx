import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ClearLayeredGlass from './ClearLayeredGlassContainer';

export default {
    title: 'CSE-UIKIT/ClearLayeredGlass',
    component: ClearLayeredGlass,
} as ComponentMeta<typeof ClearLayeredGlass>;

const Template: ComponentStory<typeof ClearLayeredGlass> = () =>
(
    <ClearLayeredGlass />
)

export const Primary = Template.bind({});