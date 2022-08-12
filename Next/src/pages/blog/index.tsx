import type { NextPage } from "next";
import Blog from "../../components/blog/Blog";
import Link from "next/link";
import { data } from "../../mock";
import type { Element } from "../../components/blog/types";
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
  const [paragraph, setParagraph] = useState<Element[][]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/filesystem/get/published?DocumentID=7`,
        {
          method: "GET",
        }
      ).then((res) => res.json());
      console.log(JSON.parse(data.Response.Contents));
      setParagraph(JSON.parse(data.Response.Contents) as Element[][]);
    }
    fetchData();
  }, []);

  return (
    <PageContainer>
      <MainContainer>
        <h1>blog1</h1>
        <Blog elements={paragraph} />
        <Link href="/">home</Link>
      </MainContainer>
    </PageContainer>
  );
};

export default BlogPage;
