import styled from "styled-components";
import React, { useState, FC, useEffect } from "react";
import { Descendant } from "slate";

import EditorHeader from "src/deprecated/components/Editor/EditorHeader";

import BoldButton from "src/cse-ui-kit/small_buttons/BoldButton";
import EditorBlock from "./components/EditorBlock";

type BlockData = Descendant[];
export type UpdateValues = (idx: number, updatedBlock: BlockData) => void;

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

  useEffect(() => {
    console.log(blocks);
  }, [blocks]);

  const updateValues: UpdateValues = (idx: number, updatedBlock: BlockData) => {
    if (JSON.stringify(blocks[idx]) !== JSON.stringify(updateValues)) return;
    setBlocks((prev) =>
      prev.map((block, i) => (i === idx ? updatedBlock : block))
    );
  };

  return (
    <div style={{ height: "100%" }}>
      <EditorHeader />
      <ButtonsContainer>
        <button
          style={{ userSelect: "none" }}
          onClick={() => {
            setBlocks((prev) => [...prev, []]);
          }}
        >
          add block
        </button>
        <BoldButton
          size={35}
          onClick={() => {
            console.log("clicked");
          }}
        />
      </ButtonsContainer>
      <Container>
        {blocks.map((_, idx) => (
          <EditorBlock key={idx} id={idx} update={updateValues} />
        ))}
      </Container>
    </div>
  );
};

export default EditorPage;
