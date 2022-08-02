import React, { FC } from "react";
import { useSlate } from "slate-react";
import { toggleMark } from "./buttonHelpers";
import { Editor } from "slate";

const EditorCenterAlignButton: FC = () => {
  const editor = useSlate();
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        Editor.addMark(editor, "align", "center")
      }}
    />
  );
};

export default EditorCenterAlignButton;
