// Import React dependencies.
import React, { FC, useMemo, useCallback, useState } from "react";
import styled from "styled-components";
// Import the Slate editor factory.
import { createEditor, Descendant } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";

import BoldButton from "src/cse-ui-kit/small_buttons/BoldButton";
import { UpdateValues } from "..";

const EditorContainer = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin: 5px;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 10px;
  padding-right: 10px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`;

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
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

const initialValues: Descendant[] = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable plain text, just like a <textarea>!" },
    ],
  },
];

const EditorBlock: FC<{ update: UpdateValues; id: number }> = ({
  update,
  id,
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
    <EditorContainer>
      <Slate
        editor={editor}
        value={initialValues}
        onChange={() => update(id, editor.children)}
      >
        {true && (
          <ToolbarContainer>
            <BoldButton size={30} />
            <BoldButton size={30} />
          </ToolbarContainer>
        )}
        <Editable
          renderLeaf={renderLeaf}
          style={{ width: "100%", height: "100%" }}
        />
      </Slate>
    </EditorContainer>
  );
};

export default EditorBlock;
