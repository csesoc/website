import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Sphere from './Sphere';
import { Box } from "@mui/material";

// More on flexDirection type casting: https://stackoverflow.com/questions/62432985/typescript-saying-a-string-is-invalid-even-though-its-in-the-union
const BoxContainerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "30px"
}

export default {
    title: 'CSE-UIKIT/Spheres',
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
            Default Sphere
            <Sphere />
        </Box>
        <Box {...BoxContainerStyle}>
            Modified Sphere
            <Sphere {...args} />
        </Box>
    </Box>
)

export const Primary = Template.bind({});
// The main colour below (#969DC7) represents violet whilst the secondary 
// colour (#DAE9FB) represents blue
Primary.args = {
    size: 200,
    colourMain: "#969DC7",
    colourSecondary: "#DAE9FB",
    startMainPoint: -12,
    startSecondaryPoint: 76,
    angle: 261,
    blur: 2,
    rotation: 93.47,
}