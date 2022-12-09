import styled from "styled-components";
import React, { useState, FC, useRef, useEffect } from "react";

import Client from "./websocketClient";

import { BlockData, UpdateCallback } from "./types";
import CreateContentBlock from "src/cse-ui-kit/CreateContentBlock_button";
import CreateHeadingBlock from "src/cse-ui-kit/CreateHeadingBlock_button";
import { ReactComponent as Tick } from "src/assets/successtick.svg"
import SyncDocument from "src/cse-ui-kit/SyncDocument_button";
import PublishDocument from "src/cse-ui-kit/PublishDocument_button";
import EditorHeader from "src/deprecated/components/Editor/EditorHeader";
import { useParams } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import Button from "@mui/material/Button";
import { buildComponentFactory } from "./componentFactory";
import { OperationManager } from "./operationManager";
import { publishDocument } from "./api/cmsFS/volumes";
import { CMSOperation } from "./api/OTClient/operation";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InsertContentWrapper = styled.div`
  display: flex;
`;

const SuccessModal = styled.div`
  width: 25vw;  
  height: max-content;
  background: #ffffff;
  border-color: none;
  border-radius: 10px;
  padding: 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: grey;
  font-weight: 340;
  font-size: 17px;
  line-height: 27pt;
  word-wrap: break-word;
`

const SuccessTitle = styled.div`
  font-weight: 470;
  font-size: 25px;
  padding-top: 1rem;
`

const SuccessText = styled.div`
  padding: 0.5rem 0 1rem 0;
`

const ContinueButton = styled(Button)`
  && {
    width: 160px;
    variant: contained;
    background-color: #74d189;
    border-radius: 20px;
    text-transform: none;
    color: black;
    &:hover {
      transform: scale(1.04);
      background-color: #69b57a;
    }
    &:active {
      transform: scale(0.96);
      background-color: #69b57a;
    }
  }
`;


const EditorPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [actionTaken, setSuccessTitle] = useState("");
  const handleClose = () => setOpen(false);
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
    const newElement = { type: type, children: [{ text: "" }] };

    // push and update this creation operation to the operation manager
    setBlocks((prev) => [...prev, [newElement]]);
    setFocusedId(blocks.length);
    opManager.current?.pushToServer(newCreationOperation(newElement, blocks.length));
  }

  function SuccessWindow() {
    return (
      <SuccessModal>
        <Tick
          height={100}
          width={100}
          fill="#74d189"
        />
        <SuccessTitle>
          Success
        </SuccessTitle>
        <SuccessText>
          {actionTaken}
        </SuccessText>
        <ContinueButton
          onClick={handleClose}
        >
          Continue
        </ContinueButton>
      </SuccessModal>
    )
  }

  return (
    <div style={{ height: "100%" }}>
      <Dialog
        open={open}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: '0px 0px 100px 8px rgba(0, 0, 0, .3)',
            borderRadius: 5,
          },
        }}
      >
        <SuccessWindow />
      </Dialog>
      <EditorHeader />
      <Container>
        {blocks.map((block, idx) => createBlock(block, idx, focusedId === idx))}
        <InsertContentWrapper>
          <CreateHeadingBlock onClick={buildButtonClickHandler("heading")} />
          <CreateContentBlock onClick={buildButtonClickHandler("paragraph")} />
          <SyncDocument onClick={() => {
            syncDocument();
            setOpen(true);
            setSuccessTitle("Document has been synced successfully!");
          }} />
          <PublishDocument onClick={() => {
            publishDocument(id ?? "");
            setOpen(true);
            setSuccessTitle("Document has been published successfully!");
          }} />
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