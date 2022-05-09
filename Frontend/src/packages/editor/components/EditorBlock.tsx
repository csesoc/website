// Import React dependencies.
import React, { FC, useMemo, useCallback } from "react";
import styled from "styled-components";
// Import the Slate editor factory.
import { createEditor, Descendant } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";

import BoldButton from "src/cse-ui-kit/small_buttons/BoldButton";
import ItalicButton from "src/cse-ui-kit/small_buttons/ItalicButton";
import UnderlineButton from "src/cse-ui-kit/small_buttons/UnderlineButton";
import ContentBlock from "../../../cse-ui-kit/contentblock/contentblock-wrapper";
import { UpdateValues } from "..";

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
  update: UpdateValues;
  id: number;
  showToolBar: boolean;
  onClick: () => void;
}

const EditorBlock: FC<EditorBlockProps> = ({
  update,
  id,
  showToolBar,
  onClick,
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
            <BoldButton size={30} />
            <ItalicButton size={30} />
            <UnderlineButton size={30} />
          </ToolbarContainer>
        )}
        <Editable
          renderLeaf={renderLeaf}
          onClick={() => onClick()}
          style={{ width: "100%", height: "100%" }}
        />
      </Slate>
    </ContentBlock>
  );
};

export default EditorBlock;
