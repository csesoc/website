import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import EventsContainer from './EventsContainer';
import { Box } from "@mui/material";

// More on flexDirection type casting: https://stackoverflow.com/questions/62432985/typescript-saying-a-string-is-invalid-even-though-its-in-the-union
const BoxContainerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center"
}

export default {
    title: 'CSE-UIKIT/Events',
    component: EventsContainer,
} as ComponentMeta<typeof EventsContainer>;

const Template: ComponentStory<typeof EventsContainer> = () =>
(
    <EventsContainer />
)

export const Primary = Template.bind({});