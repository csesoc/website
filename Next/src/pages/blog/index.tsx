import type { NextPage } from "next";
import Blog from "../../components/Blog";
import Link from "next/link";
import { Element } from "../../types";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BlogPage: NextPage = () => {
  return (
    <PageContainer>
      <MainContainer>
        <h1>blog1</h1>
        <Blog elements={data} />
        <Link href="/">home</Link>
      </MainContainer>
    </PageContainer>
  );
};

const data: Element[] = [
  {
    type: "paragraph",
    children: [
      { text: "Lorem Ipsum", bold: true, link: "https://www.lipsum.com/" },
      {
        text: " is simply dummy text of the printing and typesetting industry.",
        bold: true,
      },
      { text: "Lorem Ipsum has been ", bold: true },
      { text: "the industry standard", underline: true, bold: true },
      {
        text: " dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      },
    ],
  },
  {
    type: "paragraph",
    align: "center",
    children: [
      {
        text: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      },
      {
        text: " It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        bold: true,
      },
      {
        text: "Lorem Ipsum",
        bold: true,
        italic: true,
        underline: true,
      },
      {
        text: " passages",
        bold: true,
        italic: true,
      },
      {
        text: ", and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        bold: true,
      },
    ],
  },
];

export default BlogPage;
