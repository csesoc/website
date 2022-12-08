import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import { NavbarOpenHandler, NavbarType } from "../../components/navbar/types";
import styled from "styled-components";
import Post from "../../components/blog/Post";
import img from './test.png'

const ContentWrapper = styled.div`
	display: flex;
  flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
  margin-top: -5rem;

  position: relative; 
  z-index: 999;
`

const PostRowContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 75%;
    margin: 3em 0;
`

const Index: NextPage = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const handleToggle: NavbarOpenHandler = () => {
    setNavbarOpen(!navbarOpen);
  };
  return (
    <div>
      <Navbar open={navbarOpen} setNavbarOpen={handleToggle} variant={NavbarType.BLOG} />
      <ContentWrapper>
        <PostRowContainer>
            <Post size="full" img={img} topic="testing123" title="Testing123123123" paragraph="hello this is a test paragraph for the blog"/>
        </PostRowContainer>
        <PostRowContainer>
            <Post size="s" img={img} topic="testing123" title="Testing123123123" paragraph="hello this is a test paragraph for the blog"/>
            <Post size="s" img={img} topic="testing123" title="Testing123123123" paragraph="hello this is a test paragraph for the blog"/>
            <Post size="s" img={img} topic="testing123" title="Testing123123123" paragraph="hello this is a test paragraph for the blog"/>
        </PostRowContainer>
        <PostRowContainer>
            <Post size="s" img={img} topic="testing123" title="Testing123123123" paragraph="hello this is a test paragraph for the blog"/>
            <Post size="l" img={img} topic="testing123" title="Testing123123123" paragraph="hello this is a test paragraph for the blog"/>
        </PostRowContainer>
        <PostRowContainer>
            <Post size="m" img={img} topic="testing123" title="Testing123123123" paragraph="hello this is a test paragraph for the blog"/>
            <Post size="m" img={img} topic="testing123" title="Testing123123123" paragraph="hello this is a test paragraph for the blog"/>
        </PostRowContainer>
      </ContentWrapper>
      <Footer />
    </div>
  );
};

export default Index;