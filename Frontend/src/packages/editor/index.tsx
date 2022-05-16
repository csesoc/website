import styled from "styled-components";
import React, { useState, FC, useEffect } from "react";

import EditorBlock from "./components/EditorBlock";
import { BlockData, UpdateHandler } from "./types";
import CreateContentBlock from "src/cse-ui-kit/CreateContentBlock_button";
import EditorHeader from "src/deprecated/components/Editor/EditorHeader";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 10px;
`;

const EditorPage: FC = () => {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [focusedId, setFocusedId] = useState<number>(0);

  useEffect(() => {
    console.log(blocks);
  }, [blocks]);

  const updateValues: UpdateHandler = (idx, updatedBlock) => {
    if (JSON.stringify(blocks[idx]) !== JSON.stringify(updateValues)) return;
    setBlocks((prev) =>
      prev.map((block, i) => (i === idx ? updatedBlock : block))
    );
  };

  return (
    <div style={{ height: "100%" }}>
      <EditorHeader />
      <Container>
        {blocks.map((_, idx) => (
          <EditorBlock
            id={idx}
            key={idx}
            update={updateValues}
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

export default EditorPage;
