import { Editor, BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

const toggleMark = (
  editor: BaseEditor & ReactEditor,
  format: "bold" | "italic" | "underline"
): void => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (
  editor: BaseEditor & ReactEditor,
  format: "bold" | "italic" | "underline"
): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export { toggleMark, isMarkActive };
