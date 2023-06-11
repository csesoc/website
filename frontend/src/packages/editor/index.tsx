import styled from "styled-components";
import React, { useState, FC, useRef, useEffect } from "react";

import Client from "./websocketClient";

import { BlockData, UpdateCallback } from "./types";
import CreateContentBlock from "src/cse-ui-kit/CreateContentBlock_button";
import CreateHeadingBlock from "src/cse-ui-kit/CreateHeadingBlock_button";
import SyncDocument from "src/cse-ui-kit/SyncDocument_button";
import PublishDocument from "src/cse-ui-kit/PublishDocument_button";
import EditorHeader from "src/deprecated/components/Editor/EditorHeader";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { buildComponentFactory } from "./componentFactory";
import { OperationManager } from "./operationManager";
import { publishDocument } from "./api/cmsFS/volumes";
import { CMSOperation } from "./api/OTClient/operation";
import CreateCodeBlock from "src/cse-ui-kit/CreateCodeBlock_button ";

import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InsertContentWrapper = styled.div`
  display: flex;
`;

const ButtonContainer = styled.div`
  display: flex;
`

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`

type LocationState = {
  filename: string;
};

const EditorPage: FC = () => {
  const { id } = useParams();
  const wsClient = useRef<Client | null>(null);
  const opManager = useRef<OperationManager | null>(new OperationManager());

  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [focusedId, setFocusedId] = useState<number>(0);

  const state = useLocation().state as LocationState;
  const filename = state != null ? state.filename : "";

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

  const navigate = useNavigate();
  
  return (
    <div style={{ height: "100%" }}>
      <EditorHeader>
          <LeftContainer>
            <IconButton aria-label="back" onClick={() => navigate(-1)} sx={{ 'paddingRight': '20px' }}>
              <ArrowBackIcon fontSize="inherit"/>
            </IconButton>
            {filename}
          </LeftContainer>
          <ButtonContainer>
            <SyncDocument onClick={() => syncDocument()} />
            <PublishDocument onClick={() => publishDocument(id ?? "")} />
          </ButtonContainer>
      </EditorHeader>
      <Container>
        {blocks.map((block, idx) => createBlock(block, idx, focusedId === idx))}
        <InsertContentWrapper>
          <CreateHeadingBlock onClick={buildButtonClickHandler("heading")} />
          <CreateContentBlock onClick={buildButtonClickHandler("paragraph")} />
          <CreateCodeBlock    onClick={buildButtonClickHandler("code")} />
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

export default EditorPage;