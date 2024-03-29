import styled from "styled-components";
import { TextStyle } from "./types";
import { device } from "../../styles/device";

const Text = styled.span<TextStyle>`
  font-weight: ${(props) => (props.bold ? 600 : 400)};
  font-style: ${(props) => (props.italic ? "italic" : "normal")};
  text-decoration-line: ${(props) => (props.underline ? "underline" : "none")};
  text-align: ${(props) => props.align};
  font-size: ${(props) => `${props.textSize}px` ?? "16px"};
  word-wrap: break-word;
  font-family: ${(props) => props.code ? "monospace" : "inherit"};
  background-color: ${(props) => props.code ? "#eee" : "#fff"};
  color: ${(props) => (props.quote ? '#9e9e9e' : 'black')};
  border-left: ${(props) => (props.quote ? "3px solid #9e9e9e" : "auto")};
  margin: ${(props) => (props.quote ? "0px" : "auto")};
  padding-left: ${(props) => (props.quote ? "10px" : "0px")};

  min-width: 200px;
  @media ${device.tablet} {
    min-width: 500px;
  }

  @media (min-width: 1920px) {
    min-width: 1250px;
  }
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
  min-width: 200px;
  @media ${device.tablet} {
    min-width: 500px;
  }

  @media (min-width: 1920px) {
    min-width: 1250px;
  }
`;

const CodeContainer = styled.div`
  margin: 0em;
  padding-left: 0.5em;
  font-family: monospace;
  background: #f5f2f0;
`

const CodeLineWrapper = styled.pre`
  margin: 0px !important;
  padding: 1.5px !important; 
  overflow: hide !important;
  `
  
  const CodeLine = styled.code`
  margin: 0px !important;
  padding: 0px !important;
  font-size: 0.85rem !important;
  white-space: pre-wrap !important;
  word-break: break-word !important;
  `

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
  CodeContainer,
  CodeLine,
  CodeLineWrapper
};
