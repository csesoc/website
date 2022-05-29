import React, { useState } from 'react';
import styled from "styled-components"

import ContentBlock from "./components/ContentBlock";
import EditorHeader from "src/deprecated/components/Editor/EditorHeader";
import CreateContentBlock from "src/cse-ui-kit/CreateContentBlock_button";
import { BlockData } from "./types";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 10px;
`;

const Editor = () => {

  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [focusedId, setFocusedId] = useState<number>(0);

  return (
    <div style={{ height: "100%" }}>
      <EditorHeader />
      <Container id="content-block-draggable">
        {blocks.map((_, idx) => (
          <ContentBlock
            id={idx}
            key={idx}
            showToolBar={focusedId === idx}
            onEditorClick={() => setFocusedId(idx)}
          />
        ))}
        <CreateContentBlock
          onClick={() => {
            setBlocks((prev) => [...prev, []]);
            setFocusedId(blocks.length);
          }}
        />
      </Container>
    </div>
  );
};


export default Editor;