import styled from "styled-components";
import { createEditor, Descendant } from "slate";
import React, { FC, useMemo, useCallback } from "react";
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  useSlate,
} from "slate-react";

import { BlockData, UpdateHandler } from "../types";
import EditorBoldButton from "./buttons/EditorBoldButton";
import EditorItalicButton from "./buttons/EditorItalicButton";
import EditorUnderlineButton from "./buttons/EditorUnderlineButton";
import EditorSelectFont from "./buttons/EditorSelectFont";
import EditorCenterAlignButton from "./buttons/EditorCenterAlignButton";
import EditorLeftAlignButton from "./buttons/EditorLeftAlignButton";
import EditorRightAlignButton from "./buttons/EditorRightAlignButton";

import ContentBlock from "../../../cse-ui-kit/contentblock/contentblock-wrapper";
import { toggleMark, handleKey } from "./buttons/buttonHelpers";
import { getBlockContent } from "../state/helpers";

// Redux
import { useDispatch } from "react-redux";
import { updateContent } from "../state/actions";

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

interface EditorBlockProps {
  update: UpdateHandler;
  initialValue: BlockData;
  id: number;
  showToolBar: boolean;
  onEditorClick: () => void;
}

const EditorBlock: FC<EditorBlockProps> = ({
  id,
  update,
  initialValue,
  showToolBar,
  onEditorClick,
}) => {
  const dispatch = useDispatch();
  const editor = useMemo(() => withReact(createEditor()), []);

  const renderLeaf: (props: RenderLeafProps) => JSX.Element = useCallback(
    ({ attributes, children, leaf }) => {
      return leaf.align == null ? (
        <Text
          // Nullish coalescing operator
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
          bold={leaf.bold ?? false}
          italic={leaf.italic ?? false}
          underline={leaf.underline ?? false}
          textSize={leaf.textSize ?? 16}
          align={leaf.align ?? "left"}
          {...attributes}
        >
          {children}
        </Text>
      ) : (
        <AlignedText
          // Nullish coalescing operator
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
          bold={leaf.bold ?? false}
          italic={leaf.italic ?? false}
          underline={leaf.underline ?? false}
          align={leaf.align ?? "left"}
          textSize={leaf.textSize ?? defaultTextSize}
          {...attributes}
        >
          {children}
        </AlignedText>
      );
    },
    []
  );

  // const initialValue = getBlockContent(id);

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => {
        update(id, editor.children);

        dispatch(
          updateContent({
            id: id,
            data: value,
          })
        );
      }}
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
      <ContentBlock>
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
