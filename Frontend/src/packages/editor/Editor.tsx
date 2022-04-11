import React, { useState } from 'react';
import styled from 'styled-components';
import { Box } from "@mui/material";
import EditorHeader from 'src/deprecated/components/Editor/EditorHeader';
import EditorFile from 'src/deprecated/components/Editor/EditorFile';
import EditorSidebar from 'src/deprecated/components/Editor/EditorSidebar';
import BoldButton from 'src/cse-ui-kit/small_buttons/BoldButton';
import ItalicButton from 'src/cse-ui-kit/small_buttons/ItalicButton';
import UnderlineButton from 'src/cse-ui-kit/small_buttons/UnderlineButton';
import LeftAlignButton from 'src/cse-ui-kit/text_alignment_buttons/LeftAlign';
import MiddleAlignButton from 'src/cse-ui-kit/text_alignment_buttons/MiddleAlign';
import RightAlignButton from 'src/cse-ui-kit/text_alignment_buttons/RightAlign';

import { EditorState } from "draft-js";

const args = {
  background: "#E2E1E7",
  size: 30
}

const BoxContainerStyle = {
  display: "flex",
  flexDirection: "row" as const,
  alignItems: "center",
  gap: 1,
  padding: 1
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Editor: React.FC = () => {
  const [editorState, setEditorState] = useState(() => {
    return EditorState.createEmpty();
  });

  return (
    <div style={{ height: '100%' }}>
      <EditorHeader />
      <div className="Editor" style={{ display: 'flex' }}>
        <EditorSidebar
          editorState={editorState}
          setEditorState={setEditorState} />
        <div style={{ flex: 1 }}>
          <Box {...BoxContainerStyle}>
            <BoldButton {...args} />
            <ItalicButton {...args} />
            <UnderlineButton {...args} />
            <LeftAlignButton {...args} />
            <MiddleAlignButton {...args} />
            <RightAlignButton {...args} />
          </Box>
          <Container>
            <EditorFile
              editorState={editorState}
              setEditorState={setEditorState} />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Editor;