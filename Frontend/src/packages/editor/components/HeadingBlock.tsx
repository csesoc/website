import styled from "styled-components";
import { createEditor } from "slate";
import React, { FC, useMemo, useCallback } from "react";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";

import { UpdateHandler } from "../types";
import EditorSelectFont from './buttons/EditorSelectFont'
import ContentBlock from "../../../cse-ui-kit/contentblock/contentblock-wrapper";
import { handleKey } from "./buttons/buttonHelpers";
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
  textSize: number;
}>`
  font-size: ${(props) => (props.textSize)}px;
`;

interface HeadingBlockProps {
  update: UpdateHandler;
  id: number;
  showToolBar: boolean;
  onEditorClick: () => void;
}

const HeadingBlock: FC<HeadingBlockProps> = ({
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
          textSize={leaf.textSize ?? 24}
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
          <EditorSelectFont />
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

export default HeadingBlock;
