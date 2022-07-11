import styled from "styled-components";
import { createEditor, Descendant } from "slate";
import React, { FC, useMemo, useCallback } from "react";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";

import { UpdateHandler } from "../types";
import EditorBoldButton from "./buttons/EditorBoldButton";
import EditorItalicButton from "./buttons/EditorItalicButton";
import EditorUnderlineButton from "./buttons/EditorUnderlineButton";
import ContentBlock from "../../../cse-ui-kit/contentblock/contentblock-wrapper";
import { getBlockContent } from "../state/helpers";

// Redux
import { useDispatch } from "react-redux";
import {updateContent} from "../state/actions";

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

  const dispatch  = useDispatch();
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
          {...attributes}
        >
          {children}
        </Text>
      );
    },
    []
  );

  const initialValue = getBlockContent(id);

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => {
        update(id, editor.children)

        dispatch(updateContent({
          id: id,
          data: value,
        }))
      }}
    >
      {showToolBar && (
        <ToolbarContainer>
          <EditorBoldButton />
          <EditorItalicButton />
          <EditorUnderlineButton />
        </ToolbarContainer>
      )}
      <ContentBlock>
        <Editable
          renderLeaf={renderLeaf}
          onClick={() => onEditorClick()}
          style={{ width: "100%", height: "100%" }}
        />
      </ContentBlock>
    </Slate>
  );
};

export default EditorBlock;
