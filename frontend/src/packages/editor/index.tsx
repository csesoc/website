import styled from "styled-components";
import React, { useState, FC, useRef, useEffect } from "react";

import Client from "./websocketClient";

import { BlockData, UpdateCallback } from "./types";
import CreateContentBlock from "src/cse-ui-kit/CreateContentBlock_button";
import CreateHeadingBlock from "src/cse-ui-kit/CreateHeadingBlock_button";
import SyncDocument from "src/cse-ui-kit/SyncDocument_button";
import PublishDocument from "src/cse-ui-kit/PublishDocument_button";
import EditorHeader from "src/deprecated/components/Editor/EditorHeader";
import { useParams } from "react-router-dom";

import { buildComponentFactory } from "./componentFactory";
import { OperationManager } from "./operationManager";
import { publishDocument } from "./api/cmsFS/volumes";
import { CMSOperation } from "./api/OTClient/operation";
import CreateCodeBlock from "src/cse-ui-kit/CreateCodeBlock_button ";

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InsertContentWrapper = styled.div`
  display: flex;
`;

const EditorPage: FC = () => {
  const { id } = useParams();
  const wsClient = useRef<Client | null>(null);
  const opManager = useRef<OperationManager | null>(new OperationManager());

  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [focusedId, setFocusedId] = useState<number>(0);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    console.log("yoo", items);
    setBlocks(items);
  }

  const updateValues: UpdateCallback = (idx, updatedBlock) => {
    const requiresUpdate = JSON.stringify(blocks[idx]) !== JSON.stringify(updateValues);
    if (!requiresUpdate) return;

    setBlocks((prev) => prev.map((block, i) => (i === idx ? updatedBlock : block)));
  };

  const createBlock = buildComponentFactory(opManager.current ?? new OperationManager(), setFocusedId, updateValues);

  useEffect(() => {
    function cleanup() {
      wsClient.current?.close();
    }

    wsClient.current = new Client(
      id as string,
      (data) => { setBlocks(data as BlockData[]); },
      (reason) => { console.log(`Server connection terminated, reason: ${reason}`); }
    );

    window.addEventListener("beforeunload", cleanup);
    return () => {
      console.log("Editor component destroyed");
      wsClient.current?.close();
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  // TODO: remove me once OT integration is complete
  const syncDocument = () => {
    if (wsClient.current?.socket.readyState === WebSocket.OPEN) {
      console.log(JSON.stringify(blocks));
      wsClient.current?.pushDocumentData(JSON.stringify(blocks));
    }
  }

  // buildClickHandler builds handlers for events where new blocks are created and propagates them to the OT manager
  const buildButtonClickHandler = (type: "heading" | "paragraph" | "code") => () => {
    const newElement = { type: type, children: [{ text: "" }] };

    // push and update this creation operation to the operation manager
    setBlocks((prev) => [...prev, [newElement]]);    
    setFocusedId(blocks.length);
    opManager.current?.pushToServer(newCreationOperation(newElement, blocks.length));
  }  

  return (
    <div style={{ height: "100%" }}>
      <EditorHeader>
          <SyncDocument onClick={() => syncDocument()} />
          <PublishDocument onClick={() => publishDocument(id ?? "")} />
      </EditorHeader>
      <Container>
      <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="blocks">
            {(provided : any) => (
              <ul className="blocks" {...provided.droppableProps} ref={provided.innerRef}>
                {blocks.map((block, idx) => 
                  {
                  return (
                    <Draggable key={idx} draggableId={idx.toString()} index={idx}>
                      {(provided : any) => (
                        <span ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          {createBlock(block, idx, focusedId === idx)}
                        </span>
                      )}
                    </Draggable>
                  );}    
                )}
                <InsertContentWrapper>
                  <CreateHeadingBlock onClick={buildButtonClickHandler("heading")} />
                  <CreateContentBlock onClick={buildButtonClickHandler("paragraph")} />
                  <CreateCodeBlock    onClick={buildButtonClickHandler("code")} />
                </InsertContentWrapper>
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </Container>
    </div>
  );
};

// constructs a new creation operation in response to the insertion of a new paragraph/heading
const newCreationOperation = (newValue: any, index: number): CMSOperation => ({
  Path: [index],
  OperationType: "insert",
  IsNoOp: false,
  Operation: {
    "$type": "objectOperation",
    objectOperation: { newValue }, 
  }
});

export default EditorPage;