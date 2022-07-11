import type { NextPage } from "next";
import Blog from "../../components/blog/Blog";
import Link from "next/link";
import { data } from "../../mock";
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

export default BlogPage;
