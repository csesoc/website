import styled from "styled-components";
import React, { useState, FC } from "react";

import TitleBlock from "./components/TitleBlock";
import EditorBlock from "./components/EditorBlock";
import { BlockData, UpdateHandler } from "./types";
import CreateContentBlock from "src/cse-ui-kit/CreateContentBlock_button";
import CreateTitleBlock from "src/cse-ui-kit/CreateTitleBlock_button";
import EditorHeader from "src/deprecated/components/Editor/EditorHeader";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InsertContentWrapper = styled.div`
  display: flex;
`

const EditorPage: FC = () => {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [focusedId, setFocusedId] = useState<number>(0);

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
        {blocks.map((block, idx) => (
          block[0].type === "paragraph" ?
            <EditorBlock
              id={idx}
              key={idx}
              update={updateValues}
              showToolBar={focusedId === idx}
              onEditorClick={() => setFocusedId(idx)}
            /> 
            :
            <TitleBlock 
              id={idx}
              key={idx}
              update={updateValues}
              showToolBar={focusedId === idx}
              onEditorClick={() => setFocusedId(idx)}
            />
        ))}
        
        <InsertContentWrapper>
          <CreateTitleBlock
            onClick={() => {
              setBlocks((prev) => [...prev, 
                [
                  {
                    type:"heading", 
                    children: [{ text: "" }]
                  }
                ]]);
              setFocusedId(blocks.length);
            }}
          />
          <CreateContentBlock
            onClick={() => {
              setBlocks((prev) => [...prev, [
                {
                  type:"paragraph", 
                  children: [{ text: "" }]
                }
              ]]);
              setFocusedId(blocks.length);
            }}
          />
        </InsertContentWrapper>
      </Container>
    </div>
  );
};

export default EditorPage;
