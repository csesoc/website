import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Sphere from './Sphere';
import { Box } from "@mui/material";

// More on flexDirection type casting: https://stackoverflow.com/questions/62432985/typescript-saying-a-string-is-invalid-even-though-its-in-the-union
const BoxContainerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center"
}

export default {
    title: 'CSE-UIKIT/SmallButtons',
    component: Sphere,
} as ComponentMeta<typeof Sphere>;

const Template: ComponentStory<typeof Sphere> = (args) =>
(
    <Box
        margin="30px"
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="flex-start"
        gap="30px"
    >
        <Box {...BoxContainerStyle}>
            Bold Button
            <Sphere {...args} />
        </Box>
    </Box>
)

export const Primary = Template.bind({});
Primary.args = {
    background: "#000000",
}