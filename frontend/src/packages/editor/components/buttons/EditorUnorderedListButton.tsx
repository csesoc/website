import React, { FC } from 'react';
import { useSlate } from 'slate-react';
import { toggleBlock } from './buttonHelpers';
import UnorderedListButton from 'src/cse-ui-kit/small_buttons/UnorderedListButton';

const EditorUnorderedListButton: FC = () => {
  const editor = useSlate();
  return (
    <UnorderedListButton
      size={30}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, 'unordered-list');
      }}
    />
  );
};

export default EditorUnorderedListButton;
