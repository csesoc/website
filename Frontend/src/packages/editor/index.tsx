import styled from "styled-components";
import React, { useState, FC } from "react";

import EditorBlock from "./components/EditorBlock";
import { BlockData, UpdateHandler } from "./types";
import CreateContentBlock from "src/cse-ui-kit/CreateContentBlock_button";
import EditorHeader from "src/deprecated/components/Editor/EditorHeader";
import { addContentBlock } from "./state/actions";
import { defaultContent } from "./state/helpers";

// Redux
import { useDispatch } from "react-redux";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EditorPage: FC = () => {
  const dispatch = useDispatch();

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

            // create the initial state of the content block to Redux
            dispatch(addContentBlock({
              id: blocks.length,
              data: defaultContent
            }))
          }}
        />
      </Container>
    </div>
  );
};

export default EditorPage;
