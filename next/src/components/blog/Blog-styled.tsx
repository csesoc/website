import styled from "styled-components";
import { TextStyle } from "./types";
import { device } from "../../styles/device";

const Text = styled.span<TextStyle>`
  font-weight: ${(props) => (props.bold ? 600 : 400)};
  font-style: ${(props) => (props.italic ? "italic" : "normal")};
  text-decoration-line: ${(props) => (props.underline ? "underline" : "none")};
  text-align: ${(props) => props.align};
  font-size: ${(props) => `${props.textSize}px` ?? "16px"};
`;

const AlignedText = Text.withComponent("div");

const StyledLink = styled.span`
  color: red;
`;

const ImagePlaceholder = styled.div`
  width: 200px;
  height: 200px;
  background-color: #5a6978;
`;

const ParagraphContainer = styled.div`
  padding: 10px;
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

const BlogHeading = styled.span`
  font-weight: 800;
  font-size: 35px;
  padding: 20px 0px;
`;

export {
  Text,
  StyledLink,
  AlignedText,
  ImagePlaceholder,
  BlogContainer,
  BlogHeading,
  ParagraphContainer,
};
