// Individul chip representing a single template in the Template Selector
// Matthew Rossouw, @omeh-a (09/2021)
// # # # 
// Renders a MaterialUI chip for a template. A material UI tooltip contains
// the description for the template.


import { Avatar, Chip, Tooltip } from '@mui/material';
import React from 'react';


interface TemplateProps {
    name : string,
    description : string,
    img: string, // todo - find some way to link this image to a thumbnail contained by backend
    isSelected: boolean,
    click: (name : string) => void
}

/**
 * Representation of a single template. Returns its name to the Selector
 * upon click to let it know which one is selected.
 */
const TemplateChip : React.FC<TemplateProps> = ({name, description, img, click, isSelected}) => {
    return (
        <Tooltip title = {description}>
            <Chip
                id = {name}
                label = {name}
                avatar = {<Avatar>{name.substring(0,1)}</Avatar>}
                onClick = {() => {click(name)}}
                color = {isSelected ? "primary" : "default"}
                style = {{margin: "3px"}}
            />

        </Tooltip>
    )
}


export default TemplateChip