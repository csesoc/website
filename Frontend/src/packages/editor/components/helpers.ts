import {Editor as SlateEditor} from "slate";

export const toggleMark = (editor: SlateEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    SlateEditor.removeMark(editor, format)
  } else {
    SlateEditor.addMark(editor, format, true)
  }
};

export const isMarkActive = (editor: SlateEditor, format: string): boolean => {
  const marks = SlateEditor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};