import styled from "styled-components";
import { createEditor } from "slate";
import React, { FC, useMemo, useCallback } from "react";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";

import { CMSBlockProps } from "../types";
import EditorSelectFont from './buttons/EditorSelectFont'
import ContentBlock from "../../../cse-ui-kit/contentblock/contentblock-wrapper";
import { handleKey } from "./buttons/buttonHelpers";
import MediaContentBlockWrapper from "../../../cse-ui-kit/mediablock/mediacontentblock-wrapper";
import MediaContentBlock from "src/cse-ui-kit/MediaContentBlock/MediaContentBlock";

const defaultTextSize = 24;

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 660px;
  margin: 5px;
`;

const Text = styled.span<{
  textSize: number;
}>`
  font-size: ${(props) => (props.textSize)}px;
`;


const MediaBlock: FC<CMSBlockProps> = ({
  id,
  update,
  showToolBar,
  initialValue,
  onEditorClick,
}) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  const renderLeaf: (props: RenderLeafProps) => JSX.Element = useCallback(
    ({ attributes, children, leaf }) => {
      return (
        <Text 
          textSize={leaf.textSize ?? defaultTextSize} 
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
      value={initialValue}
      onChange={(value) => { update(id, editor.children, editor.operations); }}
    >
      <MediaContentBlockWrapper focused={showToolBar}>
        {/* <Editable
          renderLeaf={renderLeaf}
          onClick={() => onEditorClick()}
          style={{ width: "100%", height: "100%" }}
          onKeyDown={(event) => handleKey(event, editor)}
          autoFocus
        /> */}
          <MediaContentBlock onClick={() => onEditorClick()}/>
      </MediaContentBlockWrapper>
    </Slate>
  );
};

export default MediaBlock;
