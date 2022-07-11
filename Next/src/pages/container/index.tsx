import type { NextPage } from "next";
import Blog from "../../components/container/Container";
import Link from "next/link";
import { blogdata } from "../../mock";
import styled from "styled-components";

// "../../../public/assets/blog";
const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const BlogPage: NextPage = () => {
  return (
    <PageContainer>
      <MainContainer>
        <Blog elements={blogdata} />
      </MainContainer>
    </PageContainer>
  );
};

export default BlogPage;