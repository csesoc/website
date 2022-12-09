import styled from "styled-components";
import React, { useState, FC, useRef, useEffect } from "react";

import Client from "./websocketClient";

import HeadingBlock from "./components/HeadingBlock";
import EditorBlock from "./components/EditorBlock";
import { BlockData, UpdateHandler } from "./types";
import CreateContentBlock from "src/cse-ui-kit/CreateContentBlock_button";
import CreateHeadingBlock from "src/cse-ui-kit/CreateHeadingBlock_button";
import { ReactComponent as Tick } from "src/assets/successtick.svg"
import SyncDocument from "src/cse-ui-kit/SyncDocument_button";
import PublishDocument from "src/cse-ui-kit/PublishDocument_button";
import EditorHeader from "src/deprecated/components/Editor/EditorHeader";
import Dialog from '@mui/material/Dialog';
import Button from "@mui/material/Button";
import { addContentBlock } from "./state/actions";
import { useParams } from "react-router-dom";
import { defaultContent, headingContent } from "./state/helpers";

// Redux
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [actionTaken, setSuccessTitle] = useState("");
  const handleClose = () => setOpen(false);
  const { id } = useParams();
  const wsClient = useRef<Client | null>(null);

  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [focusedId, setFocusedId] = useState<number>(0);

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

  const updateValues: UpdateHandler = (idx, updatedBlock) => {
    if (JSON.stringify(blocks[idx]) === JSON.stringify(updateValues)) return;
    setBlocks((prev) =>
      prev.map((block, i) => (i === idx ? updatedBlock : block))
    );
  };

  useEffect(() => {
    function cleanup() {
      wsClient.current?.close();
    }

    wsClient.current = new Client(
      id as string,
      (data) => {
        console.log(id, JSON.stringify(data));
        setBlocks(data as BlockData[]);
      },
      (reason) => {
        console.log(reason);
      }
    );
    window.addEventListener("beforeunload", cleanup);
    return () => {
      console.log("Editor component destroyed");
      wsClient.current?.close();
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);


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
        {blocks.map((block, idx) => {
          console.log(block[0].type);
          return block[0].type === "paragraph" ? (
            <EditorBlock
              id={idx}
              key={idx}
              initialValue={block}
              update={updateValues}
              showToolBar={focusedId === idx}
              onEditorClick={() => setFocusedId(idx)}
            />
          ) : (
            <HeadingBlock
              id={idx}
              key={idx}
              update={updateValues}
              showToolBar={focusedId === idx}
              onEditorClick={() => setFocusedId(idx)}
            />
          );
        })}

        <InsertContentWrapper>
          <CreateHeadingBlock
            onClick={() => {
              setBlocks((prev) => [
                ...prev,
                [{ type: "heading", children: [{ text: "" }] }],
              ]);

              // create the initial state of the content block to Redux
              dispatch(
                addContentBlock({
                  id: blocks.length,
                  data: headingContent,
                })
              );
              setFocusedId(blocks.length);
            }}
          />
          <CreateContentBlock
            onClick={() => {
              setBlocks((prev) => [
                ...prev,
                [{ type: "paragraph", children: [{ text: "" }] }],
              ]);

              // create the initial state of the content block to Redux
              dispatch(
                addContentBlock({
                  id: blocks.length,
                  data: defaultContent,
                })
              );
              setFocusedId(blocks.length);
            }}
          />
          <SyncDocument
            onClick={() => {
              if (wsClient.current?.socket.readyState === WebSocket.OPEN) {
                console.log(JSON.stringify(blocks));
                wsClient.current?.pushDocumentData(JSON.stringify(blocks));
                setOpen(true);
                setSuccessTitle("Document has been synced successfully!");
              }
            }}
          />
          <PublishDocument
            onClick={() => {
              fetch("/api/filesystem/publish-document", {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  DocumentID: `${id}`,
                }),
              }).then((res) => {
                res.text();
                setOpen(true);
                setSuccessTitle("Document has been published successfully!");
              });
            }}
          />
        </InsertContentWrapper>
      </Container>
    </div>
  );
};

export default EditorPage;
