import styled from "styled-components";
import { TextStyle } from "./types";
import { device } from "../../styles/device";

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
  // text-align: ${(props) => props.align ?? "left"};
  text-align: left;
`;

const BlogContainer = styled.div`
  max-width: 700px;
  font-size: 1.25rem;
  margin: 60px;

  @media (max-width: 768px) {
    padding: 20px 2vw;
  }

  @media ${device.laptop} {
    max-width: 1440px;
  }


`;

const BlogHeading = styled.span<TextStyle>`
  font-weight: 800;
  font-size: 35px;
  padding: 20px 0 20px 0;

`

export { Text, StyledLink, ImagePlaceholder, ParagraphBlock, BlogContainer, BlogHeading };
