import styled from "styled-components";
import { createEditor } from "slate";
import React, { FC, useMemo, useCallback} from "react";
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
  textSize: number;
  align: string;
}>`
  font-weight: ${(props) => (props.bold ? 600 : 400)};
  font-style: ${(props) => (props.italic ? "italic" : "normal")};
  font-size: ${(props) => props.textSize}px;
  text-decoration-line: ${(props) => (props.underline ? "underline" : "none")};
  text-align: ${(props) => props.align};
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
      const props = {
        bold: leaf.bold ?? false,
        italic: leaf.italic ?? false,
        underline: leaf.underline ?? false,
        align: leaf.align ?? "left",
        textSize: leaf.textSize ?? defaultTextSize,
        ...attributes
      }
      
      return leaf.align == null 
              ? <Text {...props}>{children}</Text>
              : <AlignedText {...props}>{children}</AlignedText>;
      },
    []
  );

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => update(id, editor.children, editor.operations)}
    >
      {showToolBar && (
        <ToolbarContainer>
          <EditorBoldButton />
          <EditorItalicButton />
          <EditorUnderlineButton />
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
          autoFocus
        />
      </ContentBlock>
    </Slate>
  );
};

export default EditorBlock;
