import React, { FC } from "react";
import { useSlate } from "slate-react";
import { toggleMark } from "./buttonHelpers";
import { Editor } from "slate";
import LeftAlignButton from "src/cse-ui-kit/small_buttons/LeftAlignButton";

const EditorLeftAlignButton: FC = () => {
  const editor = useSlate();
  return (
    <LeftAlignButton
      size={30}
      onMouseDown={(event) => {
        event.preventDefault();
        Editor.addMark(editor, "align", "left")
      }}
    />
  );
};

export default EditorLeftAlignButton;
