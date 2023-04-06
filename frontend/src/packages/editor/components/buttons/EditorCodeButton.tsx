import React, { FC } from "react";
import { useSlate } from "slate-react";
import CodeButton from "src/cse-ui-kit/small_buttons/CodeButton";
import { toggleMark } from "./buttonHelpers";

const EditorCodeButton: FC = () => {
  const editor = useSlate();
  return (
    <CodeButton
      size={30}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, "code");
      }}
    />
  );
};

export default EditorCodeButton;
