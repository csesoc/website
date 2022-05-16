import React, {ReactNode, useCallback, useMemo, useState} from 'react';
import { Box, IconButton } from "@mui/material";

import bold from '../../assets/bold-button.svg';
import italics from '../../assets/italics-button.svg';
import underline from '../../assets/underline-button.svg';
import BoldButton from 'src/cse-ui-kit/small_buttons/BoldButton';
import ItalicButton from 'src/cse-ui-kit/small_buttons/ItalicButton';
import UnderlineButton from 'src/cse-ui-kit/small_buttons/UnderlineButton';
import LeftAlignButton from 'src/cse-ui-kit/text_alignment_buttons/LeftAlign';
import MiddleAlignButton from 'src/cse-ui-kit/text_alignment_buttons/MiddleAlign';
import RightAlignButton from 'src/cse-ui-kit/text_alignment_buttons/RightAlign';

// slate-js dependencies
import {Editable, Slate, useSlate, withReact} from "slate-react";
import { createEditor, Descendant, Editor as SlateEditor } from "slate";
import styled from "styled-components";


type RenderLeafProps = {
  attributes: any
  children: ReactNode
  leaf: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }
}

const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: flex-start;
  margin: 10px 20px;
  height: fit-content;
`
const args = {
  background: "#E2E1E7",
  size: 30
};

const Editor = () => {

  const renderElement = useCallback(props => <Element { ...props } />, []);
  const renderLeaf = useCallback(props => < Leaf { ...props } />, []);
  const editor = useMemo(() => withReact(createEditor()), []);

  return (
    <Slate editor={editor} value={initialValue}>
      <Toolbar>
        <BoldButton {...args} />
        <ItalicButton {...args} />
        <UnderlineButton {...args} />
        <LeftAlignButton {...args} />
        <MiddleAlignButton {...args} />
        <RightAlignButton {...args} />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
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

const isMarkActive = (editor:any, format:string) => {
  const marks = SlateEditor.marks(editor)
  return marks ? marks[format] === true : false
}

const MarkButton = (format: string) => {
  const editor = useSlate();
  return (
    <BoldButton {...args}
      active={{isMarkActive(editor, format)}}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <BoldButton {...args} />
    </BoldButton>
  )
}

const toggleMark = (editor:any, format:string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    SlateEditor.removeMark(editor, format)
  } else {
    SlateEditor.addMark(editor, format, true)
  }
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

export default Editor;