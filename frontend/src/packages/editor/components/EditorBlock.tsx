import styled from "styled-components";
import { createEditor } from "slate";
import React, { FC, useMemo, useCallback } from "react";
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
} from "slate-react";

import { CMSBlockProps } from "../types";
import EditorBoldButton from "./buttons/EditorBoldButton";
import EditorItalicButton from "./buttons/EditorItalicButton";
import EditorUnderlineButton from "./buttons/EditorUnderlineButton";
import EditorSelectFont from "./buttons/EditorSelectFont";
import EditorCenterAlignButton from "./buttons/EditorCenterAlignButton";
import EditorLeftAlignButton from "./buttons/EditorLeftAlignButton";
import EditorRightAlignButton from "./buttons/EditorRightAlignButton";

import ContentBlock from "../../../cse-ui-kit/contentblock/contentblock-wrapper";
import { handleKey } from "./buttons/buttonHelpers";
import EditorCodeButton from "./buttons/EditorCodeButton";

const defaultTextSize = 16;

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 660px;
  margin: 5px;
`;

const Text = styled.span<{
  bold: boolean;
  italic: boolean;
  underline: boolean;
  code: boolean;
  textSize: number;
  align: string;
}>`
  font-weight: ${(props) => (props.bold ? 600 : 400)};
  font-style: ${(props) => (props.italic ? "italic" : "normal")};
  font-size: ${(props) => props.textSize}px;
  text-decoration-line: ${(props) => (props.underline ? "underline" : "none")};
  text-align: ${(props) => props.align};
  font-family: ${(props) => props.code ? "monospace" : ""} ;
  background: ${(props) => props.code ? "#d1d1d0" : ""};
  word-wrap: ${(props) => props.code ? "break-word" : ""};
  box-decoration-break: ${(props) => props.code ? "clone" : ""};
  padding: ${(props) => props.code ? "0.1rem 0.3rem 0.2rem" : ""};
  border-radius: ${(props) => props.code ? "0.2rem" : ""};
`;

const AlignedText = Text.withComponent("div");

const EditorBlock: FC<CMSBlockProps> = ({
  id,
  update,
  initialValue,
  showToolBar,
  onEditorClick,
}) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  const renderLeaf: (props: RenderLeafProps) => JSX.Element = useCallback(
    ({ attributes, children, leaf }) => {
      if (leaf.formattable) {
        const props = {
          bold: leaf.bold ?? false,
          italic: leaf.italic ?? false,
          underline: leaf.underline ?? false,
          code: leaf.code ?? false,
          align: leaf.align ?? "left",
          textSize: leaf.textSize ?? defaultTextSize,
          ...attributes
        }

        return leaf.align == null
          ? <Text {...props}>{children}</Text>
          : <AlignedText {...props}>{children}</AlignedText>;
      } else {
        return <p {...attributes}>{children}</p>
      }
    },
    []
  );

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={() => update(id, editor.children, editor.operations)}
    >
      {showToolBar && (
        <ToolbarContainer>
          <EditorBoldButton />
          <EditorItalicButton />
          <EditorUnderlineButton />
          <EditorCodeButton />
          <EditorSelectFont />
          <EditorLeftAlignButton />
          <EditorCenterAlignButton />
          <EditorRightAlignButton />
        </ToolbarContainer>
      )}
      <ContentBlock
        focused={showToolBar}>
        <Editable
          renderLeaf={renderLeaf}
          onClick={() => onEditorClick()}
          style={{ width: "100%", height: "100%" }}
          onKeyDown={(event) => handleKey(event, editor)}
        />
      </ContentBlock>
    </Slate>
  );
};

export default EditorBlock;
