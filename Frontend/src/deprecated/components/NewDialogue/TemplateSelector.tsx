// Scrollable selector for CMS templates
// Matthew Rossouw, @omeh-a (09/2021)
// # # # 
// Note: currently draws from /data/templates.json. In future
// this should draw from the backend, although it is not required
// for our blogging MVP. State is tied to NewDialogue

import React from 'react';
import styled from 'styled-components';
import TemplateChip from './TemplateChip';

// disabled warning here because this is just placeholder
// eslint-disable-next-line
const templates : any = require("../../data/templates.json")

interface TemplateFile {
    name: string;
    description: string;
    img: string;
}

interface TemplateSelectorProps {
    selected: string,
    setSelected : (name: string) => void,
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
const TemplateSelector : React.FC<TemplateSelectorProps> = ({selected, setSelected}) => {
    return (
        <ScrollDiv>
            {templates["templates"].map((file: TemplateFile)=> {
                return (
                    // eslint-disable-next-line
                    <TemplateChip name={file.name} isSelected={file.name == selected}
                    img={file.img} description={file.description} click={() => {setSelected(file.name)}}/>
                )                   
            })}
        </ScrollDiv>
    )
}


export default TemplateSelector