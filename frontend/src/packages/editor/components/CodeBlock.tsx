import React, { FC, useMemo, useCallback } from 'react';
import { 
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  RenderElementProps,
  useSlateStatic,
  ReactEditor,
  useSlate
} from 'slate-react';

import { CustomElement, CustomText } from '../types';

import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';

import styled from 'styled-components';
import { 
  Range,
  createEditor,
  Editor,
  Element, 
  NodeEntry,
  Transforms
} from 'slate';

import { CMSBlockProps } from '../types';

import CodeContentBlock from "../../../cse-ui-kit/codeblock/codecontentblock-wrapper";
import { handleKey } from "./buttons/buttonHelpers";
import EditorCodeButton from "./buttons/EditorCodeButton";
import { normalizeTokens } from './util/normalize-tokens';

const defaultTextSize = 16;

// const CodeBlockType = 'code';
// const CodeLineType = 'code';


const StyledCodeBlock = styled.span`
  font-family: monospace;
  font-size: 16px;
  line-height: 20px;
  margin-top: 0;
  padding: 5px 13px;
  spell-check: false;
`;

const LanguageSelectWrapper = styled.select`
  content-editable: false;
  display: flex;
  justify-content: flex-end;
  right: 5px;
  top: 5px;
  z-index: 1;
`;

// const Quote = styled.blockquote`
//   border-left: 3px solid #9e9e9e;
//   margin: 0px;
//   padding-left: 10px;
// `;
// const QuoteText = Text.withComponent(Quote);
// const AlignedText = Text.withComponent('div');\

const LanguageSelect = (props: JSX.IntrinsicElements['select']) => {
  return (
    <LanguageSelectWrapper>
      <option value="css">CSS</option>
      <option value="html">HTML</option>
      <option value="java">Java</option>
      <option value="javascript">JavaScript</option>
      <option value="jsx">JSX</option>
      <option value="markdown">Markdown</option>
      <option value="php">PHP</option>
      <option value="python">Python</option>
      <option value="sql">SQL</option>
      <option value="tsx">TSX</option>
      <option value="typescript">TypeScript</option>
    </LanguageSelectWrapper>
  )
}


const CodeBlock: FC<CMSBlockProps> = ({
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
        ...attributes,
      };

      const {text, ...rest} = leaf;
      
      return <StyledCodeBlock {...props}>{children}</StyledCodeBlock>
    },
    []
  );

  const decorate = useDecorate(editor);

  return (
    <Slate
      editor={editor}
      
      value={initialValue}
      onChange={(value) => update(id, editor.children, editor.operations)}
    >
      {/* {showToolBar && <LanguageSelect/>} */}
      {/* insert drop down menu  */}
      <SetNodeToDecorations/>
      <CodeContentBlock focused={showToolBar}>

        <Editable
          decorate={decorate}
          renderElement={ElementWrapper}
          renderLeaf={renderLeaf}
          onClick={() => onEditorClick()}
          style={{ width: '100%', height: '100%' }}
          // onKeyDown={(event) => handleKey(event, editor)}
          autoFocus
        />
      </CodeContentBlock>
    </Slate>
  );
};

const ElementWrapper = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  const editor = useSlateStatic();

  if (element.type === 'code-block') {

    // Define way to change language
    const setLanguage = (language : string) => {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, { language }, { at: path });
    }

    return (
      <StyledCodeBlock>
        <LanguageSelect
          value={element.language}
          onChange = {e => setLanguage(e.target.value)}
        />
        {children}
      </StyledCodeBlock>
    )
  }

  // If we reach this point, it is a code line type
  return (
    <div {...attributes} style={{ position: 'relative' }}>
        {children}
      </div>
  );
}

const useDecorate = (editor: Editor) => {
  return useCallback(
    ([node, path]) => {
      if (Element.isElement(node) && node.type === "code-line") {
        const ranges = editor.nodeToDecorations?.get(node) || [];
        return ranges;
      }

      return []
    },
    [editor.nodeToDecorations]
  )
}

const getChildNodeToDecorations = ([block, blockPath]: NodeEntry<
  CustomElement
>) => {
  const nodeToDecorations = new Map<Element, Range[]>()

  const text = block.children.map((line : CustomText) => line.text).join('\n')
  const language = block.language ?? "JavaScript";
  const tokens = Prism.tokenize(text, Prism.languages[language])
  const normalizedTokens = normalizeTokens(tokens) // make tokens flat and grouped by line
  const blockChildren = block.children as unknown as Element[];

  for (let index = 0; index < normalizedTokens.length; index++) {
    const tokens = normalizedTokens[index];
    const element = blockChildren[index];

    if (!nodeToDecorations.has(element)) {
      nodeToDecorations.set(element, []);
    }

    let start = 0;
    for (const token of tokens) {
      const length = token.content.length;
      if (!length) {
        continue;
      }

      const end = start + length;

      const path = [...blockPath, index, 0];
      const range = {
        anchor: { path, offset: start },
        focus: { path, offset: end },
        token: true,
        ...Object.fromEntries(token.types.map(type => [type, true])),
      };

      nodeToDecorations.get(element)?.push(range);

      start = end;
    }
  }

  return nodeToDecorations
}


// precalculate editor.nodeToDecorations map to use it inside decorate function then
const SetNodeToDecorations = () => {
  const editor = useSlate();

  const blockEntries = Array.from(
    Editor.nodes<CustomElement>(editor, {
      at: [],
      mode: 'highest',
      //  Find all code block nodes
      match: n => Element.isElement(n) && n.type === 'code-block',
    })
  );
  
  const nodeToDecorations = mergeMaps(
    ...blockEntries.map(block => getChildNodeToDecorations(block))
  );
  
  editor.nodeToDecorations = nodeToDecorations;
  
  return null
}
    
const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
  const map = new Map<K, V>();

  for (const m of maps) {
    for (const item of m) {
      map.set(...item);
    }
  }

  return map;
}
// const toChildren = (content: string) => [{ text: content }]
// const toCodeLines = (content: string): Element[] =>
//   content
//     .split('\n')
//     .map(line => ({ type: 'code-line', children: toChildren(line) }))



export default CodeBlock;
