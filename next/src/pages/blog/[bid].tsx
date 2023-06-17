import type { NextPage, GetServerSideProps } from "next";
import Blog from "../../components/blog/Blog";
import type { Block } from "../../components/blog/types";
import styled from "styled-components";

// import renderer
import { NavbarType } from "../../components/navbar/types";
import Navbar from "../../components/navbar/Navbar";
import { BlogHeading } from "../../components/blog/Blog-styled";
import Footer from "../../components/footer/Footer";

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
`;

const BlogPage: NextPage<{ data: Block[] }> = ({ data }) => {
  return (
    <PageContainer>
      <Navbar
        variant={NavbarType.HOMEPAGE}
        open={false}
        setNavbarOpen={() => {}}
      />{" "}
      {/** ignore the styling */}
      <MainContainer>
        <BlogHeading>Blog Title</BlogHeading>
        <Blog blocks={data} />
      </MainContainer>
      <Footer />
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
