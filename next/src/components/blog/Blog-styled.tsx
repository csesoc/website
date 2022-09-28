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
  
  font-size: 1.25rem;
  margin: 0px 60px;

  @media ${device.tablet} {
    max-width: 700px;
  }

  @media (min-width: 1920px) {
    max-width: 1440px;
  }


`;

const BlogHeading = styled.span<TextStyle>`
  font-weight: 800;
  font-size: 35px;
  padding: 20px 0px;

`

export { Text, StyledLink, ImagePlaceholder, ParagraphBlock, BlogContainer, BlogHeading };
