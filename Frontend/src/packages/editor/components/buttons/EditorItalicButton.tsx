import React, { FC } from "react";
import { useSlate } from "slate-react";
import { toggleMark } from "./buttonHelpers";
import ItalicButton from "src/cse-ui-kit/small_buttons/ItalicButton";

const EditorItalicButton: FC = () => {
  const editor = useSlate();
  return (
    <ItalicButton
      size={30}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, "italic");
      }}
    />
  );
};

export default EditorItalicButton;
