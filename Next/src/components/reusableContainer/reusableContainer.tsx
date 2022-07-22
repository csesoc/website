import Link from "next/link";

import {
  Text,
  StyledLink,
  ImagePlaceholder,
  ParagraphBlock,
  BlogContainer,
} from "./reusableContainer-styled";
import type { BlogElement } from "./types";

const Block = ({ element }: { element: BlogElement }) => {

  if (element.type === "image") {
    const icon = new URL(element.url)
    return(
      <ImagePlaceholder>

      </ImagePlaceholder>
    );
  }
  return (
    <ParagraphBlock align={element.align}>
      {element.children.map(({ text, link, ...textStyle }, idx) => (
        <Text key={idx} {...textStyle}>
          {/* if link attribute is undefined, the current node is plain text */}
          {/* if link attribute is string, the curent node is a hyper link, with url link */}
          {link ? (
            <StyledLink>
              <Link href={link} passHref>
                {text}
              </Link>
            </StyledLink>
          ) : (
            <>{text}</>
          )}
        </Text>
      ))}
    </ParagraphBlock>
  );
};

const Blog = ({ elements }: { elements: BlogElement[] }) => {
  return (
    <BlogContainer>
      {elements.map((element, idx) => (
        <Block key={idx} element={element} />
      ))}
    </BlogContainer>
  );
};

export default Blog;