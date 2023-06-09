import Link from "next/link";

import {
  Text,
  ParagraphContainer,
  ImagePlaceholder,
  AlignedText,
  BlogContainer,
  CodeContainer,
} from "./Blog-styled";
import type { Element, Block } from "./types";

// import Prism from 'prismjs';
// import 'prismjs/themes/prism.css';
import { useEffect } from "react";

const Block = ({ element }: { element: Element }) => {
  // useEffect(() => {
  //   Prism.highlightAll();
  // }, []);
  // console.log(element.type);
  if (element.type === "image") {
    return <ImagePlaceholder>{element.url}</ImagePlaceholder>;
  }

  if (element.type === "code") {
    console.log(element);
    return (
      <CodeContainer>
        {element.children.map(({ text, language, ...textStyle }, idx) => (
        // <pre>
        //   <code className={`language-${language}}`}>
        //     {text}
        //   </code>
        // </pre>
        <Text key={idx} {...textStyle}>
          {text}
        </Text>
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
