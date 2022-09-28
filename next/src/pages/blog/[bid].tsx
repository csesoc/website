import type { NextPage, GetServerSideProps } from "next";
import Blog from "../../components/blog/Blog";
import Link from "next/link";
import type { Block } from "../../components/blog/types";
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

const BlogPage: NextPage<{ data: Block[] }> = ({ data }) => {
  return (
    <PageContainer>
      <MainContainer>
        <h1>blog1</h1>
        <Blog blocks={data} />
        <Link href="/">home</Link>
      </MainContainer>
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const data = await fetch(
    `http://backend:8080/api/filesystem/get/published?DocumentID=${
      params && params.bid
    }`,
    {
      method: "GET",
    }
  ).then((res) => res.text());
  return { props: { data: JSON.parse(data).Contents } };
};

export default BlogPage;
