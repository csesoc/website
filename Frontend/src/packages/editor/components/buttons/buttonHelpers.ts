import { Editor, BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

/**
 * decorate the selected text with the format
 * @param editor the current editor
 * @param format string from set {"bold", "italic", "underline"}
 */
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

/**
 *
 * @param editor the current editor
 * @param format string from set {"bold", "italic", "underline"}
 * @returns whether the seleted text is bold or italic or underline based on parameter
 */
const isMarkActive = (
  editor: BaseEditor & ReactEditor,
  format: "bold" | "italic" | "underline"
): boolean => {
  // https://docs.slatejs.org/concepts/07-editor
  // Editor object exposes properties of the current editor
  // and methods to modify it
  const marks = Editor.marks(editor);
  //  check whether selected text is formatted
  //  e.g. when the selected text is bold, marks["bold"] is true
  return marks ? marks[format] === true : false;
};

export { toggleMark, isMarkActive };
