import styled from "styled-components";
import type { Element, TextStyle } from "../types";
import Link from "next/link";

interface ParagraphStyle {
  align?: "left" | "right" | "center";
}

const Text = styled.span<TextStyle>`
  font-weight: ${(props) => (props.bold ? 600 : 400)};
  font-style: ${(props) => (props.italic ? "italic" : "normal")};
  text-decoration-line: ${(props) => (props.underline ? "underline" : "none")};
`;
const StyledLink = styled.span`
  color: red;
`;

const ImagePlaceholder = styled.div`
  width: 200px;
  height: 200px;
  background-color: #5a6978;
`;

const ParagraphBlock = styled.p<ParagraphStyle>`
  text-align: ${(props) => props.align ?? "left"};
`;

const BlogContainer = styled.div`
  max-width: 600px;
  font-size: 1.25rem;
`;

const Block = ({ element }: { element: Element }) => {
  if (element.type === "image") {
    return <ImagePlaceholder>{element.url}</ImagePlaceholder>;
  }
  return (
    <ParagraphBlock align={element.align}>
      {element.children.map(({ text, link, ...textStyle }, idx) => (
        <Text key={idx} {...textStyle}>
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

const Blog = ({ elements }: { elements: Element[] }) => {
  return (
    <BlogContainer>
      {elements.map((element, idx) => (
        <Block key={idx} element={element} />
      ))}
    </BlogContainer>
  );
};

export default Blog;
