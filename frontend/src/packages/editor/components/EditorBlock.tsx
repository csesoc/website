import styled from 'styled-components';
import { createEditor } from 'slate';
import React, { FC, useMemo, useCallback } from 'react';
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  RenderElementProps,
} from 'slate-react';

import { CMSBlockProps } from '../types';
import EditorBoldButton from './buttons/EditorBoldButton';
import EditorItalicButton from './buttons/EditorItalicButton';
import EditorUnderlineButton from './buttons/EditorUnderlineButton';
import EditorQuoteButton from './buttons/EditorQuoteButton';
import EditorSelectFont from './buttons/EditorSelectFont';
import EditorCenterAlignButton from './buttons/EditorCenterAlignButton';
import EditorLeftAlignButton from './buttons/EditorLeftAlignButton';
import EditorRightAlignButton from './buttons/EditorRightAlignButton';

import ContentBlock from '../../../cse-ui-kit/contentblock/contentblock-wrapper';
import { handleKey } from './buttons/buttonHelpers';
import EditorCodeButton from './buttons/EditorCodeButton';
import EditorUnorderedListButton from './buttons/EditorUnorderedListButton';
import EditorOrderedListButton from './buttons/EditorOrderedListButton';

const defaultTextSize = 16;

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 660px;
  margin: 5px;
`;

const Text = styled.span<{
  bold: boolean;
  italic: boolean;
  underline: boolean;
  code: boolean | string;
  quote: boolean;
  textSize: number;
  align: string;
}>`
  font-weight: ${(props) => (props.bold ? 600 : 400)};
  font-style: ${(props) => (props.italic ? 'italic' : 'normal')};
  font-size: ${(props) => props.textSize}px;
  font-family: ${(props) => (props.code ? 'monospace' : 'inherit')};
  text-decoration-line: ${(props) => (props.underline ? 'underline' : 'none')};
  text-align: ${(props) => props.align};
  background-color: ${(props) => (props.code ? '#eee' : '#fff')};
`;

const Quote = styled.blockquote`
  border-left: 3px solid #9e9e9e;
  margin: 0px;
  padding-left: 10px;

  span {
    font-style: italic;
    color: #9e9e9e;
  }
`;
const AlignedText = Text.withComponent('div');

const EditorBlock: FC<CMSBlockProps> = ({
  id,
  update,
  initialValue,
  showToolBar,
  onEditorClick,
}) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  const renderElement: (props: RenderElementProps) => JSX.Element = useCallback(
    ({ attributes, children, element }) => {
      switch (element.type) {
        case 'quote':
          console.log('why');
          return <Quote {...attributes}>{children}</Quote>;
        case 'unordered-list':
          return <ul {...attributes}>{children}</ul>;
        case 'ordered-list':
          return <ol {...attributes}>{children}</ol>;
        case 'list-item':
          return <li {...attributes}>{children}</li>;
        default:
          return <span {...attributes}>{children}</span>;
      }
    },
    []
  );
  const renderLeaf: (props: RenderLeafProps) => JSX.Element = useCallback(
    ({ attributes, children, leaf }) => {
      const props = {
        bold: leaf.bold ?? false,
        italic: leaf.italic ?? false,
        underline: leaf.underline ?? false,
        quote: leaf.quote ?? false,
        code: leaf.code ?? false,
        align: leaf.align ?? 'left',
        textSize: leaf.textSize ?? defaultTextSize,
        ...attributes,
      };

      return leaf.align == null ? (
        <Text {...props}>{children}</Text>
      ) : (
        <AlignedText {...props}>{children}</AlignedText>
      );
    },
    []
  );

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => update(id, editor.children, editor.operations)}
    >
      {showToolBar && (
        <ToolbarContainer>
          <EditorBoldButton />
          <EditorItalicButton />
          <EditorUnderlineButton />
          <EditorCodeButton />
          <EditorQuoteButton />
          <EditorSelectFont />
          <EditorUnorderedListButton />
          <EditorOrderedListButton />
          <EditorLeftAlignButton />
          <EditorCenterAlignButton />
          <EditorRightAlignButton />
        </ToolbarContainer>
      )}
      <ContentBlock focused={showToolBar}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onClick={() => onEditorClick()}
          style={{ width: '100%', height: '100%' }}
          onKeyDown={(event) => handleKey(event, editor)}
          autoFocus
        />
      </ContentBlock>
    </Slate>
  );
};

export default EditorBlock;
