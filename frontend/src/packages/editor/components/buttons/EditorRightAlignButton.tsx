import React, { FC } from "react";
import { useSlate } from "slate-react";
import { toggleMark } from "./buttonHelpers";
import { Editor } from "slate";
import RightAlignButton from "src/cse-ui-kit/small_buttons/RightAlignButton";

const EditorRightAlignButton: FC = () => {
  const editor = useSlate();
  return (
    <RightAlignButton
      size={30}
      onMouseDown={(event) => {
        event.preventDefault();
        Editor.addMark(editor, "align", "right")
      }}
    />
  );
};

export default EditorRightAlignButton;
