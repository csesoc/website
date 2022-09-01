import React, { FC } from "react";
import { useSlate } from "slate-react";
import { toggleMark } from "./buttonHelpers";
import { Editor } from "slate";
import CenterAlignButton from "src/cse-ui-kit/small_buttons/CenterAlignButton";

const EditorCenterAlignButton: FC = () => {
  const editor = useSlate();
  return (
    <CenterAlignButton
      size={30}
      onMouseDown={(event) => {
        event.preventDefault();
        Editor.addMark(editor, "align", "center")
      }}
    />
  );
};

export default EditorCenterAlignButton;
