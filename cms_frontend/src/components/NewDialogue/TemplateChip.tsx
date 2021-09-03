// Matt Rossouw

import { Avatar, Button, Chip, Tooltip} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import React from 'react';
import styled from 'styled-components';


interface TemplateProps {
    name : string,
    description : string,
    img: string,
}

const handleClick = () => {
    alert("clicked")
}

/**
 * Representation 
 */
const TemplateChip : React.FC<TemplateProps> = ({name, description, img}) => {


    return (
        <Tooltip title = {description}>
            <Chip
                label = {name}
                avatar = {<Avatar>{name.substring(0,1)}</Avatar>}
                onClick = {handleClick}
                color = "primary"
                style = {{margin: "3px"}}
            />

        </Tooltip>
    )
}


export default TemplateChip