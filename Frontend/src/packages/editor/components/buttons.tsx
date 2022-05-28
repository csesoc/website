import React from "react";
import { useSlate } from "slate-react";

import BoldButton from "src/cse-ui-kit/small_buttons/BoldButton";
import ItalicButton from "src/cse-ui-kit/small_buttons/ItalicButton";
import UnderlineButton from "src/cse-ui-kit/small_buttons/UnderlineButton";
import { toggleMark } from "./helpers";

export const EditorBoldButton = () => {
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

export const EditorItalicButton = () => {
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

export const EditorUnderlineButton = () => {
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