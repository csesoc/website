import React, { FC } from "react";
import { useSlate } from "slate-react";
import { toggleMark } from "./buttonHelpers";
import ChecklistButton from "src/cse-ui-kit/small_buttons/ChecklistButton";
import { Editor } from "slate";

const EditorChecklistButton: FC = () => {
  const editor = useSlate();
  return (
    <ChecklistButton
      size={30}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, "checklist")
        toggleMark(editor, "checked")
      }}
    />
  );
};

export default EditorChecklistButton;
