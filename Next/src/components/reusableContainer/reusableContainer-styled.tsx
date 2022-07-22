import styled from "styled-components";
import { TextStyle, Image } from "./types";

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
  width: 340px;
  height: 237px;
  border-radius: 20px;
  background-image: black;
`;

const ParagraphBlock = styled.p<ParagraphStyle>`
  text-align: ${(props) => props.align ?? "left"};
`;

const BlogContainer = styled.div`
  max-width: 367px;
  height: 540px;
  font-size: 1.2rem;
  background-color: #F3E7DB;
  border-radius: 50px;
  padding: 10px;
  margin: 1.5rem;
`;

export { Text, StyledLink, ImagePlaceholder, ParagraphBlock, BlogContainer };