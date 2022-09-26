import type { NextPage } from "next";
import Blog from "../../components/blog/Blog";
import Link from "next/link";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const [paragraph, setParagraph] = useState<Block[]>([]);
  const { bid } = router.query;

  useEffect(() => {
    async function fetchData() {
      console.log(bid);
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/filesystem/get/published?DocumentID=${bid}`,
        {
          method: "GET",
        }
      ).then((res) => res.text());
      console.log(data);
      // console.log(JSON.parse(data.Response.Contents));
      // setParagraph(JSON.parse(data.Response.Contents) as Block[]);
    }
    if (bid) {
      fetchData();
    }
  }, [bid]);

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
