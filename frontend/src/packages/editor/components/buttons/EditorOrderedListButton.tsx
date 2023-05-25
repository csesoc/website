import React, { FC } from 'react';
import { useSlate } from 'slate-react';
import { toggleBlock } from './buttonHelpers';
import OrderedListButton from 'src/cse-ui-kit/small_buttons/OrderedListButton';

const EditorOrderedListButton: FC = () => {
  const editor = useSlate();
  return (
    <OrderedListButton
      size={30}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, 'ordered-list');
      }}
    />
  );
};

export default EditorOrderedListButton;
