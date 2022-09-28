import Link from "next/link";

import {
  Text,
  ParagraphContainer,
  ImagePlaceholder,
  AlignedText,
  BlogContainer,
} from "./Blog-styled";
import type { Element, Block } from "./types";

const Block = ({ element }: { element: Element }) => {
  if (element.type === "image") {
    return <ImagePlaceholder>{element.url}</ImagePlaceholder>;
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
