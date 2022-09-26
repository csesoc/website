import Link from "next/link";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import {
  Text,
  StyledLink,
  ImagePlaceholder,
  BlogHeading,
  ParagraphBlock,
  BlogContainer,
} from "../../components/blog/Blog-styled";
import type { Element } from "../../components/blog/types";
import styled from "styled-components";
import Footer from "../../components/footer/Footer";
import logo from "../../../public/assets/WebsitesIcon.png";
import { device } from "../../styles/device";
import Image from "next/image";

// import renderer
import { data as MockData } from "../../mock/index";
import Blog from "../../components/blog/Blog";


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

const BlogPage = () => {
  const [data, setData] = useState<Element[]>([]);

  // onmount
  useEffect(() => {
    setData(MockData); // will be replaced with a rest api call
  },[])

  return (
    <PageContainer>
      <Navbar open={false} setNavbarOpen={() => {}} /> {/** ignore the styling */}
      <MainContainer>
          <BlogHeading>Blog Title</BlogHeading>
          <Blog elements={data}/>
      </MainContainer>
      <Footer/>
    </PageContainer>
  );
};

export default BlogPage;
