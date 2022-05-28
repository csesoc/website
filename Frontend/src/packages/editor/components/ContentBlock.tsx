import React, {ReactNode, useCallback, useMemo, useState} from 'react';
import { EditorBoldButton, EditorItalicButton, EditorUnderlineButton } from "./buttons";

// slate-js dependencies
import { Editable, Slate } from "slate-react";
import { createEditor, Descendant, Editor as SlateEditor } from "slate";
import styled from "styled-components";
import {withHistory} from "slate-history";


type RenderLeafProps = {
  attributes: any
  children: ReactNode
  leaf: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }
}

const BlockContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  height: fit-content;
  border: 1px solid black;
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

const ContentBlock = () => {

  const renderElement = useCallback(props => <Element { ...props } />, []);
  const renderLeaf = useCallback(props => < Leaf { ...props } />, []);
  const editor = useMemo(() => withHistory(createEditor()), []);

  return (
    <BlockContainer>
      <Slate editor={editor} value={initialValue}>
        <Toolbar>
          <EditorBoldButton />
          <EditorItalicButton />
          <EditorUnderlineButton />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
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

const initialValue: Descendant[] = [
  {
    type: 'heading-two',
    children: [
      { text: 'A heading' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "This is a paragraph.",
      },
      {
        text: "bold",
        bold: true
      }
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A block quote.' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'text in the center' }],
  },
]

export default ContentBlock;