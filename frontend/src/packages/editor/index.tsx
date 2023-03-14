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

// import {v4 as uuidv4} from 'uuid';

import { buildComponentFactory } from "./componentFactory";
import { OperationManager } from "./operationManager";
import { publishDocument } from "./api/cmsFS/volumes";
import { CMSOperation } from "./api/OTClient/operation";

import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import DeleteBlock from "src/cse-ui-kit/DeleteBlock_button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InsertContentWrapper = styled.div`
  display: flex;
`;

const BlockWrapper = styled.div`
  display: flex;
  width: 70%;
  justify-content: center
`;

const BlockContainer = styled.div`
  flex-grow: 3
`;

const EditorPage: FC = () => {
  const { id } = useParams();
  const wsClient = useRef<Client | null>(null);
  const opManager = useRef<OperationManager | null>(new OperationManager());

  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [focusedId, setFocusedId] = useState<number>(0);

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
  const buildButtonClickHandler = (type: "heading" | "paragraph") => () => {
    // TODO: More robust key creation
    const newElement = { type: type, key: Math.random().toString(), children: [{ text: "" }] };
    console.log(newElement.key);

    // push and update this creation operation to the operation manager
    setBlocks((prev) => [...prev, [newElement]]);    
    setFocusedId(blocks.length);
    opManager.current?.pushToServer(newCreationOperation(newElement, blocks.length));
  }


  const deleteButtonClickHandler = (idx : number) => () => {
    setFocusedId(-1);
    const newBlocks = [...blocks];
    newBlocks.splice(idx, 1);
    setBlocks(newBlocks);
  }

  return (
    <div style={{ height: "100%" }}>
      <EditorHeader>
          <SyncDocument onClick={() => syncDocument()} />
          <PublishDocument onClick={() => publishDocument(id ?? "")} />
      </EditorHeader>
      <Container>
          {
            // TODO Make this not ugly
          }
          {blocks.map((block, idx) => 
            <BlockWrapper key={idx}>
              {/* <IconButton
                sx={{
                  display: focusedId == idx ? "block" : "none"
                }}
                
              >
                <CloseIcon/>
              </IconButton> */}
              <DeleteBlock onClick={deleteButtonClickHandler(idx)} isFocused={focusedId == idx}/>
              <BlockContainer>
                {createBlock(block, idx, focusedId === idx)}
              </BlockContainer>
            </BlockWrapper>
            )
          }
        <InsertContentWrapper>
          <CreateHeadingBlock onClick={buildButtonClickHandler("heading")} />
          <CreateContentBlock onClick={buildButtonClickHandler("paragraph")} />
        </InsertContentWrapper>
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

// constructs a new deletion operation in response to the deletion of an existing block
const deletionOperation = (index: number): CMSOperation => ({
  Path: [index],
  OperationType: "delete",
  IsNoOp: false,
  Operation: {
    "$type": "noop",
    noop: {},
  }
});

export default EditorPage;