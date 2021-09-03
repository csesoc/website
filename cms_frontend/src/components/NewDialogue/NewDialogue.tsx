import { Button, TextField } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import React from 'react';
import styled from 'styled-components';


const Container = styled.div`
  width: 300px;
  height: 350px;
  background: white;
  position: absolute;
  padding: 10px;
  border: 1px solid #c7c7c7;
  left: 40%;
  top: 30%;
`

const Body = styled.div`
  display: flex;
  flex-direction: row; 
  height: 50%;
`

// Temporary placeholder until we implement the selector element
const TemplateSelector = styled.div` 
  display: flex;
  width: 60%;
  background: #f1f1f1;
  margin: 15px;
`

// Temporary placeholder until we implement the selector element
const TemplatePreview = styled.div`
  display: flex;
  width: 30%;
  background: #e7e1e1;
  margin: 15px;
`

interface DialogueProps {
  directory: string;
  isCore: boolean;
}

// Wrapper component
const NewDialogue: React.FC<DialogueProps> = ({directory, isCore}) => {
  return (
    <Container>
      <div style={{paddingLeft:"15px"}}>
        {isCore ? (<strong>New core page</strong>) : (<p>New blog post in {directory}</p>)}
        <TextField label="title"/>
      </div>
      <Body>
        <TemplateSelector>
          (select template)
        </TemplateSelector>
        <TemplatePreview>
          (preview)
        </TemplatePreview>
      </Body>
      <div style = {{margin: "auto", width: "40%", padding:"15px"}}>
        <Button variant="outlined" color="secondary" onClick={() => {
          // TODO: add handler for spawning new doc
          alert("A new document appears!")
        }}>
          New page
        </Button>
      </div>
    </Container>
  )
}

export default NewDialogue
