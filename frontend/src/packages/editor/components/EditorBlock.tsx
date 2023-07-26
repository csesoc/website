import styled from 'styled-components';
import React, { FC, useMemo, useCallback, Fragment } from 'react';
import { Slate, Editable, withReact, RenderLeafProps, useSlateStatic, useReadOnly, ReactEditor } from 'slate-react';
import { Editor, Transforms, Range, Point, createEditor, Descendant, Element as SlateElement } from 'slate'

import { CMSBlockProps, CustomEditor, CustomText } from '../types';
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
  checklist: boolean;
  checked: boolean;
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


const CheckListItemElement = (props: any) => {
  console.log("?????? why");
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '0',
        userSelect: 'none'
      }} 
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
          checked={props.checked}
          onChange={event => {
            props.checked = event.target.checked
          }}
        />
      </span>
      <span
        suppressContentEditableWarning
        style = {{ 
          flex: 1,
          opacity: props.checked ? 0.666 : 1,
          textDecoration: props.checked ? 'line-through' : 'none',}}
      >
      </span>
    </div>
  )
}


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
  const editor = useMemo(() => withReact(createEditor()), []);

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
        console.log(leaf.checked);
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
                  checked={leaf.checked}
                  onChange={event => {
                    leaf.checked = event.target.checked;
                    console.log("what", event.target.checked);
                  }}
                />
              </span>
            </div>
            <span
                suppressContentEditableWarning
                style = {{ 
                  flex: 1,
                  opacity: leaf.checked ? 0.666 : 1,
                  textDecoration: leaf.checked ? 'line-through' : 'none',}}
              >
                {children}
              </span>
        </div>
      )
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
