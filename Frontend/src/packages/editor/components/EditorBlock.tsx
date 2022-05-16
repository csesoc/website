import styled from "styled-components";
import { createEditor, Descendant } from "slate";
import React, { FC, useMemo, useCallback } from "react";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";

import { UpdateHandler } from "../types";
import EditorBoldButton from "./buttons/EditorBoldButton";
import EditorItalicButton from "./buttons/EditorItalicButton";
import EditorUnderlineButton from "./buttons/EditorUnderlineButton";
import ContentBlock from "../../../cse-ui-kit/contentblock/contentblock-wrapper";

const initialValues: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 10px;
`;

const Text = styled.span<{
  bold: boolean;
  italic: boolean;
  underline: boolean;
}>`
  font-weight: ${(props) => (props.bold ? 600 : 400)};
  font-style: ${(props) => (props.italic ? "italic" : "normal")};
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
          bold={leaf.bold ?? false}
          italic={leaf.italic ?? false}
          underline={leaf.underline ?? false}
          {...attributes}
        >
          {children}
        </Text>
      );
    },
    []
  );

  return (
    <ContentBlock>
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
          </ToolbarContainer>
        )}
        <Editable
          renderLeaf={renderLeaf}
          onClick={() => onEditorClick()}
          style={{ width: "100%", height: "100%" }}
        />
      </Slate>
    </ContentBlock>
  );
};

export default EditorBlock;