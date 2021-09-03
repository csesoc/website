// Matt Rossouw

import { Button, Chip, Container, TextField } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import React from 'react';
import styled from 'styled-components';
import { fileURLToPath } from 'url';
import TemplateChip from './TemplateChip';


const templates = require("../../data/templates.json")

interface TemplateFile {
    name: string;
    description: string;
    img: string;
}

const ScrollDiv = styled.div`
    overflow-y:scroll;
    word-break: break-all;
    flex-wrap: wrap;
    display: flex;
    width: 70%;
    background: #f1f1f1;
    margin: 10px;
`


/**
 * Subcomponent for NewDialogue which gets a list of
 * templates to present for selection by the user.
 */
const TemplateSelector : React.FC = () => {


    return (
        <ScrollDiv>
     
            {templates["templates"].map((file: TemplateFile)=> {
                return (
                    <TemplateChip name={file.name} img={file.img} description={file.description}/>
                )                   
            })}
        </ScrollDiv>
    )
}


export default TemplateSelector