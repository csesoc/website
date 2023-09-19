import Link from "next/link";

import {
  Text,
  ParagraphContainer,
  ImagePlaceholder,
  AlignedText,
  BlogContainer,
  CodeContainer,
  CodeLine,
  CodeLineWrapper,
} from "./Blog-styled";
import type { Element, Block } from "./types";

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import { useEffect } from "react";

// Supported Languages
//
// For all languages supported by Prism, visit https://prismjs.com/
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
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

const Block = ({ element }: { element: Element }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  
  if (element.type === "image") {
    return <ImagePlaceholder>{element.url}</ImagePlaceholder>;
  }

  if (element.type === "code") {
    const language = "language-" + (element.language ?? "python");

    return (
      <CodeContainer>
          {element.children.map(({ text, ...textStyle }, idx) => (
            <CodeLineWrapper key={idx}> 
              <CodeLine className={language}>
                {text}
              </CodeLine>
            </CodeLineWrapper>
        ))}
        </CodeContainer>
    )
  }

  return (
    <ParagraphContainer>
      {element.children.map(({ text, link, ...textStyle }, idx) => (
        <>
          {textStyle.align === undefined || textStyle.align === "left" ? (
            <Text key={idx} {...textStyle}>
              {text}
            </Text>
          ) : (
            <AlignedText key={idx} {...textStyle}>
              {text}
            </AlignedText>
          )}
        </>
      ))}
    </ParagraphContainer>
  );
};

const Blog = ({ blocks }: { blocks: Block[] }) => {
  return (
    <BlogContainer>
      {blocks.flat().map((element, idx) => (
        <Block key={idx} element={element} />
      ))}
    </BlogContainer>
  );
};

export default Blog;
