import React, {ReactNode, useCallback, useMemo, useState} from 'react';
import { Box, IconButton } from "@mui/material";
import Button from 'react-bootstrap/Button'

import Bold from '../../assets/bold-button.svg';
import Italics from '../../assets/italics-button.svg';
import Underline from '../../assets/underline-button.svg';
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
import {withHistory} from "slate-history";
import {CustomText} from "./types";


type RenderLeafProps = {
  attributes: any
  children: ReactNode
  leaf: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }
}
type MarkButtonProps = { format: string }


const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: flex-start;
  margin: 10px 20px;
  height: fit-content;
  outline: 1px solid black;
`
const args = {
  background: "#E2E1E7",
  size: 30
};

const Editor = () => {

  const renderElement = useCallback(props => <Element { ...props } />, []);
  const renderLeaf = useCallback(props => < Leaf { ...props } />, []);
  const editor = useMemo(() => withHistory(createEditor()), []);

  return (
    <Slate editor={editor} value={initialValue}>
      <Toolbar>
        <MarkButton format="bold" />
        <MarkButton format="italic" />
        <MarkButton format="underline" />
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

const isMarkActive = (editor: SlateEditor, format: string): boolean => {
  const marks = SlateEditor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};

const MarkButton = (props: MarkButtonProps) => {
  const { format } = props
  const editor = useSlate();
  const button = getButtonIcon(format)

  return (
    <Button
      // variant={'outline-primary'}
      className ='toolbar-btn'
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      { button }
    </Button>
  )
}

const toggleMark = (editor: SlateEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    SlateEditor.removeMark(editor, format)
  } else {
    SlateEditor.addMark(editor, format, true)
  }
};

const getButtonIcon = (format: string) => {
  switch (format) {
    case 'bold':
      return <BoldButton {...args} />
    case 'italic':
      return <ItalicButton {...args} />
    case 'underline':
      return <UnderlineButton {...args} />
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