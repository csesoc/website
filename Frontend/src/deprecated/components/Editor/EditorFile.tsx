import React from 'react';
import styled from 'styled-components';
import { Editor, EditorState, RichUtils } from "draft-js";

const EditorTitle = styled.div`
  font-size: xx-large;
  color: black;
  text-align: center;
`

const Container = styled.div`
  display: flex;
  grid-gap: 1rem;
  margin: 1rem;
  flex-direction: column;
  align-items: center;
`

const EditorDate = styled.div`
  font-size: medium;
  color: #47AEE8;
  text-align: center;
`

const EditorSubtitle = styled.div`
  font-size: large;
  color: black;
  background: #F5F5F5;
  width: 60vw; 
  height: 150px;
  text-align: center;
  padding: 2rem;
  border-radius: 10px;
`

const EditorContent = styled.div`
  font-size: medium;
  color: black;
  width: 50vw;
  background: white;
  margin-top: -100px;
  min-height: 700px;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 1px 1px lightgrey;

  // Making sure the DraftJS window focuses when we click anywhere
  // on the window
  & .public-DraftEditor-content {
    min-height: 700px;
  }
`

interface EditorProps {
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
}

const EditorFile: React.FC<EditorProps> = ({ editorState, setEditorState }) => {
  const handleKeyCommand = (command: string, state: EditorState) => {
    const newState = RichUtils.handleKeyCommand(state, command);

    if (newState != null) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  return (
    <Container>
      <EditorDate>
        27 AUGUST 2021 / ARTICLES
      </EditorDate>
      <EditorTitle>
        &quot;Heading 1&quot;
      </EditorTitle>
      <EditorSubtitle>
        Insert link to media
      </EditorSubtitle>
      <EditorContent>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState} />
      </EditorContent>
    </Container>
  );
};

export default EditorFile;
