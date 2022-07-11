import styled from "styled-components";
import { TextStyle } from "./types";

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

export { Text, StyledLink, ImagePlaceholder, ParagraphBlock, BlogContainer };
