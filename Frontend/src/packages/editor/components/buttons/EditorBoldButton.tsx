import React, { FC } from "react";
import { useSlate } from "slate-react";
import BoldButton from "src/cse-ui-kit/small_buttons/BoldButton";
import { toggleMark } from "./buttonHelpers";

const EditorBoldButton: FC = () => {
  const editor = useSlate();
  return (
    <BoldButton
      size={30}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, "bold");
      }}
    />
  );
};

export default EditorBoldButton;
