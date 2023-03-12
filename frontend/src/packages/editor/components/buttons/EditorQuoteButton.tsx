import React, { FC } from 'react';
import { useSlate } from 'slate-react';
import QuoteButton from 'src/cse-ui-kit/small_buttons/QuoteButton';
import { toggleMark } from './buttonHelpers';

const EditorQuoteButton: FC = () => {
  const editor = useSlate();
  return (
    <QuoteButton
      size={30}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, 'italic');
        toggleMark(editor, 'quote');
      }}
    />
  );
};

export default EditorQuoteButton;
