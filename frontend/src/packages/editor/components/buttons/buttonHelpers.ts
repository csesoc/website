import { Editor, BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

/**
 * decorate the selected text with the format
 * @param editor the current editor
 * @param format string from set {"bold", "italic", "underline"}
 */
const toggleMark = (
  editor: BaseEditor & ReactEditor,
  format: 'bold' | 'italic' | 'underline' | 'quote'
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
  format: 'bold' | 'italic' | 'underline' | 'quote'
): boolean => {
  // https://docs.slatejs.org/concepts/07-editor
  // Editor object exposes properties of the current editor
  // and methods to modify it
  const marks = Editor.marks(editor);
  //  check whether selected text is formatted
  //  e.g. when the selected text is bold, marks["bold"] is true
  return marks ? marks[format] === true : false;
};

const handleKey = (
  event: React.KeyboardEvent,
  editor: BaseEditor & ReactEditor
) => {
  if (!event.ctrlKey) {
    return;
  }
  switch (event.key) {
    case 'b': {
      event.preventDefault();
      toggleMark(editor, 'bold');
    }
  }
  switch (event.key) {
    case 'i': {
      event.preventDefault();
      toggleMark(editor, 'italic');
    }
  }
  switch (event.key) {
    case 'u': {
      event.preventDefault();
      toggleMark(editor, 'underline');
    }
  }
  switch (event.key) {
    case 'q': {
      event.preventDefault();
      toggleMark(editor, 'quote');
    }
  }
};

export { toggleMark, isMarkActive, handleKey };
