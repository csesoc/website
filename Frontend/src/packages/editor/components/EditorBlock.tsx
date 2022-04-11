// Import React dependencies.
import React, { FC, MouseEventHandler, useMemo, useCallback } from "react";
import styled from "styled-components";
// Import the Slate editor factory.
import { createEditor, Descendant } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";

import { UpdateValues } from "..";

const EditorContainer = styled.div`
  width: 100%;
  max-width: 500px;
  min-height: 100px;
  display: flex;
  border-radius: 10px;
  margin: 5px;
  padding: 10px;
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

const EditorBlock: FC<{ update: UpdateValues; id: number }> = ({
  update,
  id,
}) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  const preventTriple: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.detail > 2) {
      event.preventDefault();
    }
  };

  const renderElements: (props: RenderElementProps) => JSX.Element =
    useCallback((props) => {
      // eslint-disable-next-line react/prop-types
      return <span {...props.attributes}>{props.children}</span>;
    }, []);

  return (
    <EditorContainer>
      <Slate
        editor={editor}
        value={initialValues}
        onChange={() => update(id, editor.children)}
      >
        <Editable
          onClick={preventTriple}
          renderElement={renderElements}
          style={{ width: "100%", minHeight: "100%" }}
        />
      </Slate>
    </EditorContainer>
  );
};

export default EditorBlock;
