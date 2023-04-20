import React, { FC, useMemo, useCallback } from 'react';
import { Slate, Editable, withReact, RenderLeafProps } from 'slate-react';

import Prism from 'prismjs';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-jsx';
// import 'prismjs/components/prism-typescript';
// import 'prismjs/components/prism-tsx';
// import 'prismjs/components/prism-markdown';
// import 'prismjs/components/prism-python';
// import 'prismjs/components/prism-php';
// import 'prismjs/components/prism-sql';
// import 'prismjs/components/prism-java';

import styled from 'styled-components';
import { 
  createEditor,
  Editor,
  Element, 
  NodeEntry
} from 'slate';

import { CMSBlockProps } from '../types';

import CodeContentBlock from "../../../cse-ui-kit/codeblock/codecontentblock-wrapper";
import { handleKey } from "./buttons/buttonHelpers";
import EditorCodeButton from "./buttons/EditorCodeButton";

const defaultTextSize = 16;

const CodeBlockType = 'code';
const CodeLineType = 'code';


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
        // bold: leaf.bold ?? false,
        // italic: leaf.italic ?? false,
        // underline: leaf.underline ?? false,
        // quote: leaf.quote ?? false,
        // code: leaf.code ?? false,
        // align: leaf.align ?? 'left',
        // textSize: leaf.textSize ?? defaultTextSize,
        ...attributes,
      };
      
      return <StyledCodeBlock {...props}>{children}</StyledCodeBlock>
      // return leaf.quote ? (
      //   <QuoteText {...props}>{children}</QuoteText>
      // ) : leaf.align == null ? (
      //   <Text {...props}>{children}</Text>
      // ) : (
      //   <AlignedText {...props}>{children}</AlignedText>
      // );
    },
    []
  );

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => update(id, editor.children, editor.operations)}
    >
      {showToolBar && <LanguageSelect/>}
      {/* insert drop down menu  */}
      <CodeContentBlock focused={showToolBar}>

        <Editable
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

// const useDecorate = (editor: Editor) => {
//   return useCallback(
//     ([node, path]) => {
//       if (Element.isElement(node) && node.type === CodeLineType) {
//         const ranges = editor.nodeToDecorations.get(node) || []
//         return ranges
//       }

//       return []
//     },
//     [editor.nodeToDecorations]
//   )
// }

// const getChildNodeToDecorations = ([block, blockPath]: NodeEntry<
//   CodeBlockElement
// >) => {
//   const nodeToDecorations = new Map<Element, Range[]>()

//   const text = block.children.map(line => Node.string(line)).join('\n')
//   const language = block.language
//   const tokens = Prism.tokenize(text, Prism.languages[language])
//   const normalizedTokens = normalizeTokens(tokens) // make tokens flat and grouped by line
//   const blockChildren = block.children as Element[]

//   for (let index = 0; index < normalizedTokens.length; index++) {
//     const tokens = normalizedTokens[index]
//     const element = blockChildren[index]

//     if (!nodeToDecorations.has(element)) {
//       nodeToDecorations.set(element, [])
//     }

//     let start = 0
//     for (const token of tokens) {
//       const length = token.content.length
//       if (!length) {
//         continue
//       }

//       const end = start + length

//       const path = [...blockPath, index, 0]
//       const range = {
//         anchor: { path, offset: start },
//         focus: { path, offset: end },
//         token: true,
//         ...Object.fromEntries(token.types.map(type => [type, true])),
//       }

//       nodeToDecorations.get(element)!.push(range)

//       start = end
//     }
//   }

//   return nodeToDecorations
// }


export default CodeBlock;
