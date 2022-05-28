import React, {FC} from "react";
import BoldButton from "src/cse-ui-kit/small_buttons/BoldButton";
import ItalicButton from "src/cse-ui-kit/small_buttons/ItalicButton";
import UnderlineButton from "src/cse-ui-kit/small_buttons/UnderlineButton";
import {Editor as SlateEditor} from "slate";
import {useSlate} from "slate-react";

export const EditorBoldButton = () => {
//   use redux get the current editor
  const editor = useSlate();
  return (
    <BoldButton
      size={30}
      onMouseDown={(event:MouseEvent) => {
        event.preventDefault()
        toggleMark(editor, 'bold')
      }}
    />
  );
};

export const EditorItalicButton = () => {
  const editor = useSlate();
  return (
    <ItalicButton
      size={30}
      onMouseDown={(event: MouseEvent) => {
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
      onMouseDown={(event: MouseEvent) => {
        event.preventDefault();
        toggleMark(editor, "underline");
      }}
    />
  );
};

const toggleMark = (editor: SlateEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    SlateEditor.removeMark(editor, format)
  } else {
    SlateEditor.addMark(editor, format, true)
  }
};

const isMarkActive = (editor: SlateEditor, format: string): boolean => {
  const marks = SlateEditor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};