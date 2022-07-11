import React from 'react';
import styled from 'styled-components';
import { Button } from "@mui/material";
import { EditorState, RichUtils } from "draft-js";

const Container = styled.div`
  background: #eeeeee;
  width: 15vw;
  overflow-y: scroll;
`

interface EditorProps {
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
}

// Placeholder
const EditorSidebar: React.FC<EditorProps> = ({ editorState, setEditorState }) => {
  const toggle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  }

  const hasStyle = (style: string) => {
    return editorState.getCurrentInlineStyle().includes(style);
  }

  return (
    <Container>
      This is the sidebar
      <Button
        onMouseDown={event => {
          event.preventDefault();
          toggle("BOLD");
        }}
        color={hasStyle("BOLD") ? "primary" : "secondary"}>Bold</Button>
    </Container>
  );    
};

export default EditorSidebar;
