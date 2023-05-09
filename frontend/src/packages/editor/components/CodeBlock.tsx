// This implementation is heavily derived the official sample Slate implementation
// Original Code here: 
// https://github.com/ianstormtaylor/slate/blob/main/site/examples/code-highlighting.tsx
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

import prismThemeCss from './styles/PrismTheme';

import { CustomElement } from '../types';

import Prism from 'prismjs';

// Supported Languages
//
// For all languages supported by Prism, visit https://prismjs.com/
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-prolog';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-latex';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-perl';

import styled from 'styled-components';
import { 
  Range,
  createEditor,
  Editor,
  Element, 
  NodeEntry,
  Transforms,
  Node
} from 'slate';

import { CMSBlockProps } from '../types';

import CodeContentBlock from "../../../cse-ui-kit/codeblock/codecontentblock-wrapper";
import { handleKey } from "./buttons/buttonHelpers";
import EditorCodeButton from "./buttons/EditorCodeButton";
import { normalizeTokens } from './util/normalize-tokens';
import isHotkey from 'is-hotkey';


const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 600px;
  margin: 5px;
  justify-content: flex-end;
`;

const LanguageSelectWrapper = styled.select`
  content-editable: false;
  right: 5px;
  top: 5px;
  z-index: 1;
`;

const LanguageSelect = (props: JSX.IntrinsicElements['select']) => {
  return (
    <LanguageSelectWrapper value={props.value} onChange={props.onChange}>
      <option value="css">CSS</option>
      <option value="html">HTML</option>
      <option value="java">Java</option>
      <option value="javascript">JavaScript</option>
      <option value="jsx">JSX</option>
      <option value="typescript">TypeScript</option>
      <option value="tsx">TSX</option>
      <option value="markdown">Markdown</option>
      <option value="c">C</option>
      <option value="cpp">C++</option>
      <option value="php">PHP</option>
      <option value="python">Python</option>
      <option value="sql">SQL</option>
      <option value="bash">Shell</option>
      <option value="latex">LaTeX</option>
      <option value="rust">Rust</option>
      <option value="go">Go</option>
      <option value="haskell">Haskell</option>
      <option value="perl">Perl</option>
    </LanguageSelectWrapper>
  );
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

      return (
        <span {...props} className={Object.keys(rest).join(' ')}>{
          children}
        </span>
      )
    },
    []
  );

  const language = editor.children.length > 0 
    ? (editor.children[0] as Element).language 
    : "css"
  ;

  const decorate = useDecorate(editor);

  const setLanguage = (newLanguage : string) => {
    // Select entire editor and change all lines to have language `newLanguage`.
    Transforms.select(editor, {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    })
    Transforms.setNodes(editor, { language: newLanguage });
  };

  return (
    <Slate
      editor={editor}
      
      value={initialValue}
      onChange={(value) => update(id, editor.children, editor.operations)}
    >
      {showToolBar && 
        <ToolbarContainer>
          <LanguageSelect 
            value={language}
            onChange={event => setLanguage(event.target.value)}
          />
        </ToolbarContainer>
      }
      <SetNodeToDecorations/>
      <CodeContentBlock focused={showToolBar}>
        <Editable
          decorate={decorate}
          renderElement={ElementWrapper}
          renderLeaf={renderLeaf}
          onClick={() => onEditorClick()}
          autoFocus
          style={{ width: "100%", height: "100%" }}
          spellCheck={false}
          onKeyDown={useOnKeydown(editor)}
        />
        <style>{prismThemeCss}</style>
      </CodeContentBlock>
    </Slate>
  );
};

const ElementWrapper = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  return (
    <div {...attributes} style={{ position: 'relative' }}>
        {children}
    </div>
  );
}

const useDecorate = (editor: Editor) => {
  return useCallback(
    ([node, path]) => {
      const ranges = editor.nodeToDecorations?.get(node) || [];
      return ranges;
    },
    [editor.nodeToDecorations]
  );
}

// Tabbing is exclusive behaviour for code blocks
// Hence this is defined here rather than in buttonHelpers.ts with the other cases.
const useOnKeydown = (editor: Editor) => {
  const onKeyDown: React.KeyboardEventHandler = useCallback(
    e => {
      if (isHotkey('tab', e)) {
        // handle tab key, simulate tabbing by adding spaces
        e.preventDefault();

        Editor.insertText(editor, '    ');
      }
    },
    [editor]
  );

  return onKeyDown;
}

const getChildNodeToDecorations = ([block, blockPath]: NodeEntry<
  CustomElement
>) => {
  const nodeToDecorations = new Map<Element, Range[]>();

  const text = block.children.map((line) => Node.string(line)).join('\n');
  const language = block.language ?? "css";
  const tokens = Prism.tokenize(text, Prism.languages[language]);
  // make tokens flat and grouped by line
  const normalizedTokens = normalizeTokens(tokens); 
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

  return nodeToDecorations;
}


// precalculate editor.nodeToDecorations map to use it inside decorate function then
const SetNodeToDecorations = () => {
  const editor = useSlate();

  const blockEntries = Array.from(
    Editor.nodes<Element>(editor, {
      at: [],
      mode: 'highest',
      //  Find all code block nodes
      match: n => Element.isElement(n) && n.type === 'code-block',
    })
  );
  
  const nodeToDecorations = mergeMaps(
    ...blockEntries.map(getChildNodeToDecorations)
  );
  
  editor.nodeToDecorations = nodeToDecorations;
  
  return null;
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


export default CodeBlock;
