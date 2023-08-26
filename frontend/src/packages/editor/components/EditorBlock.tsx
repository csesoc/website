import styled from 'styled-components';
import React, { FC, useMemo, useCallback } from 'react';
import { Slate, Editable, withReact, RenderLeafProps, useReadOnly } from 'slate-react';
import { createEditor } from 'slate'

import { CMSBlockProps } from '../types';
import EditorBoldButton from './buttons/EditorBoldButton';
import EditorItalicButton from './buttons/EditorItalicButton';
import EditorUnderlineButton from './buttons/EditorUnderlineButton';
import EditorQuoteButton from './buttons/EditorQuoteButton';
import EditorSelectFont from './buttons/EditorSelectFont';
import EditorCenterAlignButton from './buttons/EditorCenterAlignButton';
import EditorLeftAlignButton from './buttons/EditorLeftAlignButton';
import EditorRightAlignButton from './buttons/EditorRightAlignButton';
import EditorCodeButton from "./buttons/EditorCodeButton";
import EditorChecklistButton from "./buttons/EditorChecklistButton";

import ContentBlock from "../../../cse-ui-kit/contentblock/contentblock-wrapper";
import { handleKey } from "./buttons/buttonHelpers";
import { withHistory } from 'slate-history';

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
  font-style: ${(props) => (props.italic || props.quote ? 'italic' : 'normal')};
  color: ${(props) => (props.quote ? '#9e9e9e' : 'black')};
  font-size: ${(props) => props.textSize}px;
  font-family: ${(props) => props.code ? "monospace" : "inherit"};
  text-decoration-line: ${(props) => (props.underline ? "underline" : "none")};
  text-align: ${(props) => props.align};
  background-color: ${(props) => props.code ? "#eee" : "#fff"};
`;


const CheckListItemElement = ({children, attributes, leaf}: any) => {
  const readOnly = useReadOnly()
  const [checked, setChecked] = React.useState(false)
  return (
    <div {...attributes} style={{display: 'flex', alignItems: 'left'}}>
      <div
        style={{ userSelect: "none" }}
        contentEditable={false}
      >
        <span
          contentEditable={false}
          style={{
            marginRight: '0.75em'
          }}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={event => {
              // Figure out why ReactEditor.findPath does not work
              // const path = ReactEditor.findPath(editor as ReactEditor, leaf);
              // const newProperties = {
              //   checked: event.target.checked,
              // }
              // Transforms.setNodes(editor, newProperties, { at: path })
              setChecked(event.target.checked);
            }}
          />
        </span>
    </div>
    <span
        contentEditable={!readOnly}
        suppressContentEditableWarning
        style = {{ 
          flex: 1,
          opacity: checked ? 0.666 : 1,
          textDecoration: checked ? 'line-through' : 'none',}}
      >
        {children}
    </span>
  </div>
)}


const Quote = styled.blockquote`
  border-left: 3px solid #9e9e9e;
  margin: 0px;
  padding-left: 10px;
`;
const QuoteText = Text.withComponent(Quote);
const AlignedText = Text.withComponent('div');

const EditorBlock: FC<CMSBlockProps> = ({
  id,
  update,
  initialValue,
  showToolBar,
  onEditorClick,
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

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
        checklist: leaf.checklist ?? false,
        checked: leaf.checklist ?? false,
        ...attributes,
      };


      if (leaf.checklist) {
        const checklistProps = {attributes, children, leaf}
        return <CheckListItemElement {...checklistProps}/>
      }

      return leaf.quote ? (
        <QuoteText {...props}>{children}</QuoteText>
      ) : leaf.align == null ? (
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
          <EditorChecklistButton/>
          <EditorSelectFont />
          <EditorLeftAlignButton />
          <EditorCenterAlignButton />
          <EditorRightAlignButton />
        </ToolbarContainer>
      )}
      <ContentBlock focused={showToolBar}>
        <Editable
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
