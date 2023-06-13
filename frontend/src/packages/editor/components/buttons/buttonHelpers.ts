import { Editor, BaseEditor, Transforms, Element as SlateElement } from 'slate';
import { ReactEditor } from 'slate-react';

const LIST_TYPES = ['ordered-list', 'unordered-list'];

const toggleBlock = (
  editor: BaseEditor & ReactEditor,
  format: 'paragraph' | 'heading' | 'quote' | 'ordered-list' | 'unordered-list'
) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isBlockActive = (
  editor: BaseEditor & ReactEditor,
  format: 'paragraph' | 'heading' | 'quote' | 'ordered-list' | 'unordered-list'
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

/**
 * decorate the selected text with the format
 * @param editor the current editor
 * @param format string from set {"bold", "italic", "underline", "quote"}
 */
const toggleMark = (
  editor: BaseEditor & ReactEditor,
  format: 'bold' | 'italic' | 'underline' | 'quote' | 'code'
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
 * @param format string from set {"bold", "italic", "underline", "quote "}
 * @returns whether the seleted text is bold or italic or underline based on parameter
 */
const isMarkActive = (
  editor: BaseEditor & ReactEditor,
  format: 'bold' | 'italic' | 'underline' | 'quote' | 'code'
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
  switch (event.key) {
    case '`': {
      event.preventDefault();
      toggleMark(editor, 'code');
    }
  }
};

export { toggleBlock, isBlockActive, toggleMark, isMarkActive, handleKey };
