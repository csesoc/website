import styled from "styled-components";
import { createEditor, Descendant } from "slate";
import React, { FC, useMemo, useCallback } from "react";
import { Slate, Editable, withReact, RenderLeafProps, useSlate } from "slate-react";

import { UpdateHandler } from "../types";
import EditorBoldButton from "./buttons/EditorBoldButton";
import EditorItalicButton from "./buttons/EditorItalicButton";
import EditorUnderlineButton from "./buttons/EditorUnderlineButton";
import EditorSelectFont from './buttons/EditorSelectFont'
import ContentBlock from "../../../cse-ui-kit/contentblock/contentblock-wrapper";
import { toggleMark } from "./buttons/buttonHelpers";

const initialValues: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 440px;
  margin: 5px;
`;

const Text = styled.span<{
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textSize: number;
}>`
  font-weight: ${(props) => (props.bold ? 600 : 400)};
  font-style: ${(props) => (props.italic ? "italic" : "normal")};
  font-size: ${(props) => (props.textSize)}px;
  text-decoration-line: ${(props) => (props.underline ? "underline" : "none")};
`;

interface EditorBlockProps {
  update: UpdateHandler;
  id: number;
  showToolBar: boolean;
  onEditorClick: () => void;
}

const EditorBlock: FC<EditorBlockProps> = ({
  id,
  update,
  showToolBar,
  onEditorClick,
}) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  const renderLeaf: (props: RenderLeafProps) => JSX.Element = useCallback(
    ({ attributes, children, leaf }) => {
      return (
        <Text
          // Nullish coalescing operator
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
          bold={leaf.bold ?? false}
          italic={leaf.italic ?? false}
          underline={leaf.underline ?? false}
          textSize={leaf.textSize ?? 16}
          {...attributes}
        >
          {children}
        </Text>
      );
    },
    []
  );

  return (
    <Slate
      editor={editor}
      value={initialValues}
      onChange={() => update(id, editor.children)}
    >
      {showToolBar && (
        <ToolbarContainer>
          <EditorBoldButton />
          <EditorItalicButton />
          <EditorUnderlineButton />
          <EditorSelectFont />
        </ToolbarContainer>
      )}
      <ContentBlock>
        <Editable
          renderLeaf={renderLeaf}
          onClick={() => onEditorClick()}
          style={{ width: "100%", height: "100%" }}
          onKeyDown={event => {
            if (!event.ctrlKey) {
              return
            }
            switch (event.key) {
              case 'b': {
                event.preventDefault();
                toggleMark(editor, "bold");
              }
            }
            switch (event.key) {
              case 'i': {
                event.preventDefault();
                toggleMark(editor, "italic");
              }
            }
            switch (event.key) {
              case 'u': {
                event.preventDefault();
                toggleMark(editor, "underline");
              }
            }
          }}
        />
      </ContentBlock>
    </Slate>
  );
};

export default EditorBlock;
