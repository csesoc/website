import React, { FC } from "react";
import { useSlate } from "slate-react";
import BoldButton from "src/cse-ui-kit/small_buttons/BoldButton";
import { toggleMark } from "./buttonHelpers";

const EditorCodeButton: FC = () => {
  const editor = useSlate();
  return (
    <BoldButton
      size={30}
      onMouseDown={(event) => {
        event.preventDefault();
        // TODO switch mark to code (not sure if this has to be defined)
        toggleMark(editor, "bold");
      }}
    />
  );
};

export default EditorCodeButton;
