// Import React dependencies.
import React, { useState, FC } from "react";
import styled from "styled-components";
// Import the Slate editor factory.
import { createEditor, Descendant } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

const EditorContainer = styled.div`
  width: 500px;
  height: 200px;
  display: flex;
  border-radius: 10px;
  margin: 5px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`;

const initialValues: Descendant[] = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable plain text, just like a <textarea>!" },
    ],
  },
];

const EditorBlock: FC = () => {
  const [editor] = useState(() => withReact(createEditor()));
  return (
    <EditorContainer>
      <Slate editor={editor} value={initialValues}>
        <Editable style={{ width: "100%", height: "100%" }} />
      </Slate>
    </EditorContainer>
  );
};

export default EditorBlock;
