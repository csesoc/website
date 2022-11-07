import { Text, createEditor, Range } from "slate";
import React, { FC, useMemo, useCallback, useState } from "react";
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
} from "slate-react";

import { CMSBlockProps } from "../types";
import ContentBlock from "../../../cse-ui-kit/contentblock/contentblock-wrapper";
import { handleKey } from "./buttons/buttonHelpers";

import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-java";
import { css } from "@emotion/css";


const CodeBlock: FC<CMSBlockProps> = ({
  id,
  update,
  initialValue,
  onEditorClick,
}) => {
  const [language, setLanguage] = useState('html')
  const editor = useMemo(() => withReact(createEditor()), []);

  const getLength = (token: string | Prism.Token): number => {
    if (typeof token === "string") {
      return token.length;
    } else if (typeof token.content === "string") {
      return token.content.length;
    } else {
      return (token.content as (string | Prism.Token)[]).reduce(
        (l, t) => l + getLength(t),
        0
      );
    }
  };

  // decorate function depends on the language selected
  const decorate = useCallback(
    ([node, path]) => {
      const ranges: Range[] = []
      if (!Text.isText(node)) {
        return ranges
      }
      const tokens = Prism.tokenize(node.text, Prism.languages[language])
      let start = 0

      for (const token of tokens) {
        const length = getLength(token)
        const end = start + length

        if (typeof token !== 'string') {
          ranges.push({
            [token.type]: true,
            anchor: { path, offset: start },
            focus: { path, offset: end },
          })
        }

        start = end
      }

      return ranges
    },
    [language]
  )

  const renderLeaf: (props: RenderLeafProps) => JSX.Element = useCallback(
    ({ attributes, children, leaf }) => {
      if (leaf.type === 'customCode') {
        return (
          <span
            {...attributes}
            className={css`
          font-family: monospace;
          background: hsla(0, 0%, 100%, 0.5);
          ${leaf.comment &&
              css`
            color: slategray;
          `}
          ${(leaf.operator || leaf.url) &&
              css`
            color: #9a6e3a;
          `}
          ${leaf.keyword &&
              css`
            color: #07a;
          `}
          ${(leaf.variable || leaf.regex) &&
              css`
            color: #e90;
          `}
          ${(leaf.number ||
                leaf.boolean ||
                leaf.tag ||
                leaf.constant ||
                leaf.symbol ||
                leaf["attr-name"] ||
                leaf.selector) &&
              css`
            color: #905;
          `}
          ${leaf.punctuation &&
              css`
            color: #999;
          `}
          ${(leaf.string || leaf.char) &&
              css`
            color: #690;
          `}
          ${(leaf.function || leaf["class-name"]) &&
              css`
            color: #dd4a68;
          `}
        `}
          >{children}
          </span>
        );
      } else {
        return <span>{children}</span>
      }
    },
    []
  );

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={() => update(id, editor.children, editor.operations)}
    >
      <div
        contentEditable={false}
        style={{ position: 'relative', top: '5px', right: '5px' }}
      >
        <h3>
          Select a language
          <select
            value={language}
            style={{ float: 'right' }}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="js">JavaScript</option>
            <option value="css">CSS</option>s
            <option value="html">HTML</option>
            <option value="python">Python</option>
            <option value="sql">SQL</option>
            <option value="java">Java</option>
            <option value="php">PHP</option>
          </select>
        </h3>
      </div>
      <ContentBlock>
        <Editable
          decorate={decorate}
          renderLeaf={renderLeaf}
          onClick={() => onEditorClick()}
          style={{ width: "100%", height: "100%" }}
          onKeyDown={(event) => handleKey(event, editor)}
        />
      </ContentBlock>
    </Slate>
  );
};

// modifications and additions to prism library

Prism.languages.python = Prism.languages.extend('python', {})
Prism.languages.insertBefore('python', 'prolog', {
  comment: { pattern: /##[^\n]*/, alias: 'comment' },
})
Prism.languages.javascript = Prism.languages.extend('javascript', {})
Prism.languages.insertBefore('javascript', 'prolog', {
  comment: { pattern: /\/\/[^\n]*/, alias: 'comment' },
})
Prism.languages.html = Prism.languages.extend('html', {})
Prism.languages.insertBefore('html', 'prolog', {
  comment: { pattern: /<!--[^\n]*-->/, alias: 'comment' },
})
Prism.languages.markdown = Prism.languages.extend('markup', {})
Prism.languages.insertBefore('markdown', 'prolog', {
  blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: 'punctuation' },
  code: [
    { pattern: /^(?: {4}|\t).+/m, alias: 'keyword' },
    { pattern: /``.+?``|`[^`\n]+`/, alias: 'keyword' },
  ],
  title: [
    {
      pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
      alias: 'important',
      inside: { punctuation: /==+$|--+$/ },
    },
    {
      pattern: /(^\s*)#+.+/m,
      lookbehind: !0,
      alias: 'important',
      inside: { punctuation: /^#+|#+$/ },
    },
  ],
  hr: {
    pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
    lookbehind: !0,
    alias: 'punctuation',
  },
  list: {
    pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
    lookbehind: !0,
    alias: 'punctuation',
  },
  'url-reference': {
    pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
    inside: {
      variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 },
      string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
      punctuation: /^\[\]!:]|[<>]/,
    },
    alias: 'url',
  },
  bold: {
    pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: !0,
    inside: { punctuation: /^\*\*|^__|\*\*$|__$/ },
  },
  italic: {
    pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
    lookbehind: !0,
    inside: { punctuation: /^[*_]|[*_]$/ },
  },
  url: {
    pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
    inside: {
      variable: { pattern: /(!?\[)[^\]]+(?=\]$)/, lookbehind: !0 },
      string: { pattern: /"(?:\\.|[^"\\])*"(?=\)$)/ },
    },
  },
})

export default CodeBlock;
