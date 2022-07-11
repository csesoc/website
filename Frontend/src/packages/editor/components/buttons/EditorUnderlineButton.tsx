import React, { FC } from "react";
import { useSlate } from "slate-react";
import UnderlineButton from "src/cse-ui-kit/small_buttons/UnderlineButton";
import { toggleMark } from "./buttonHelpers";

const EditorUnderlineButton: FC = () => {
  const editor = useSlate();
  return (
    <UnderlineButton
      size={30}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, "underline");
      }}
    />
  );
};

export default EditorUnderlineButton;
