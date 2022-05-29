import React, { useCallback, useMemo } from 'react';
import isHotkey from 'is-hotkey'
import styled from "styled-components";
import { useDispatch } from "react-redux";

// local imports
import { EditorBoldButton, EditorItalicButton, EditorUnderlineButton } from "./buttons";
import { toggleMark } from "./helpers";
import { RenderLeafProps, ContentBlockProps } from "./types";
import { updateContent } from "../state/actions"
import { getBlockContent } from "../state/helpers";

// slate-js dependencies
import { Editable, Slate, withReact } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";


const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  height: fit-content;
  border: 1px solid black;
  padding: 0 10px;
`

const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: center;
  height: fit-content;
  width: 100%;
  border-bottom: 1px solid black;
`

const ContentBlock = (props:ContentBlockProps) => {
  const { id, showToolBar, onEditorClick } = props
  const dispatch = useDispatch();

  const renderElement = useCallback(props => <Element { ...props } />, []);
  const renderLeaf = useCallback(props => < Leaf { ...props } />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue = JSON.parse(getBlockContent(id));

  return (
    <BlockContainer>
      <Slate editor={editor}
             value={initialValue}
             onChange={(value) => {
               const content = JSON.stringify(value)
               dispatch(updateContent({
                 id: id,
                 data: content,
               }))
             }}
      >
        <Toolbar>
          <EditorBoldButton />
          <EditorItalicButton />
          <EditorUnderlineButton />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus
          placeholder="Enter some text…"
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault()
                const mark = getHotkeyMark(hotkey)
                toggleMark(editor, mark)
              }
            }
          }}
        />
      </Slate>
    </BlockContainer>
  );
};


const Element = (props: any) => {
  const { attributes, children, element } = props
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
};

const Leaf = (props: RenderLeafProps) => {
  // eslint-disable-next-line prefer-const
  let { attributes, children, leaf } = props
  if (leaf.bold === true) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic === true) {
    children = <em>{children}</em>
  }

  if (leaf.underline === true) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
};

const getHotkeyMark  = (hotkey:string) => {
  switch (hotkey) {
    case 'mod+b':
      return 'bold'
    case 'mod+i':
      return 'italic'
    case 'mod+u':
      return 'underline'
    default:
      return ''
  }
};

export default ContentBlock;