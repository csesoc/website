import styled from "styled-components";
import { createEditor } from "slate";
import React, { FC, useMemo, useCallback, useRef } from "react";
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

const InputFile = styled.input`
  display: none;
`

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

  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

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

  /*
    Planning
    - Have a ternary op to decide whether to display the editor or placeholder graphic
    - REMINDER - need to support urls AND uploading to the backend
      - The former seems a little less complicated ;)
    - Get clarification on how backend to store and retrieve images
      - Does the getPublishedDoc endpoint contain a url to the image source in BE, or is it the
        actual image itself??
        - update: it's the base64 bits
  */

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
          {/* <MediaContentBlock onClick={() => onEditorClick()}> */}
          <MediaContentBlock onClick={() => {
            console.log("hey best friend", hiddenFileInput.current)
            hiddenFileInput.current?.click();
            onEditorClick();
          }}>
            <InputFile type="file"/>
          </MediaContentBlock>
      </MediaContentBlockWrapper>
    </Slate>
  );
};

export default MediaBlock;
