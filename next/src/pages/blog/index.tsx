import type { NextPage } from "next";
import Blog from "../../components/blog/Blog";
import Link from "next/link";
import { data } from "../../mock";
import type { Block } from "../../components/blog/types";
import { useEffect, useState } from "react";
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
  const [paragraph, setParagraph] = useState<Block[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/filesystem/get/published?DocumentID=e643b5bd-4867-4e9f-911b-40885161ae42`,
        {
          method: "GET",
        }
      ).then((res) => res.json());
      console.log(JSON.parse(data.Response.Contents));
      setParagraph(JSON.parse(data.Response.Contents) as Block[]);
    }
    fetchData();
  }, []);

  return (
    <PageContainer>
      <MainContainer>
        <h1>blog1</h1>
        <Blog blocks={paragraph} />
        <Link href="/">home</Link>
      </MainContainer>
    </PageContainer>
  );
};

export default BlogPage;
