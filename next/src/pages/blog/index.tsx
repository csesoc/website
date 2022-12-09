import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import { NavbarOpenHandler, NavbarType } from "../../components/navbar/types";
import styled from "styled-components";
import Post from "../../components/blog/Post";
import Img1 from './blogImg/photo1.png'
import Img2 from './blogImg/photo2.png'
import Img3 from './blogImg/photo3.png'
import Img4 from './blogImg/photo4.png'
import Img5 from './blogImg/photo5.png'
import Img6 from './blogImg/photo6.png'
import Img7 from './blogImg/photo7.png'
import Img8 from './blogImg/photo8.png'

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
    width: 80%;
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
          <Post size="full" img={Img2} topic="First Year Guide" title="Welcome to CSESoc's 2022 First Year Guide" paragraph="Whether you're a budding Computer Science and Engineering student, or just curious - this interactive guide is packed with advice, tips, and experiences to help you make the most out of uni!" />
        </PostRowContainer>
        <PostRowContainer>
          <Post size="s" img={Img3} topic="ARTICLES" title="Optimise Your Study Life: Study Apps" paragraph="In the second part of the series, Alex Xu walks us through study apps you can use to boost your productivity!" />
          <Post size="s" img={Img4} topic="FIRST YEAR GUIDE" title="Welcome to CSESoc's 2022 First Year Guide" paragraph="Whether you're a budding Computer Science and Engineering student, or just curious - this interactive guide is packed with advice, tips, and experiences to help you make the most out of uni!
"/>
          <Post size="s" img={Img5} topic="ECHO" title="Getting to Know the Young Woman of the Year 2020" paragraph="Ever wonder what happens in the lives of other amazing computer scientists?

Timmy and Michelle interview computer scientist Hannah Beder, who won Young Woman of the Year 2020!"/>
        </PostRowContainer>
        <PostRowContainer>
          <Post size="s" img={Img6} topic="Videos" title="segfaults at 0 1 : 1 9 a m ~ lofi hip hop beats to code to" paragraph="We've curated an hour of 💜 lofi hip hop beats 💜, perfect for you to code/study/relax/vibe/sleep to. 🌌 All the songs are super aesthetic 🌸 so you know it's good :)" />
          <Post size="l" img={Img1} topic="Echo" title="[ECHO] Is Computer Science Right For You?" paragraph="Is studying compsci is right for you? Mariya and Nat sit down with four people who've all grappled with the same question!" />
        </PostRowContainer>
        <PostRowContainer>
          <Post size="m" img={Img7} topic="FIRST YEAR GUIDE" title="Meet the CSESoc Directors 2022" paragraph="Whether you're a budding Computer Science and Engineering student, or just curious - this interactive guide is packed with advice, tips, and experiences to help you make the most out of uni!" />
          <Post size="m" img={Img8} topic="QUIZZES" title="Announcing: Quizzes!" paragraph="Nothing to do in your last few days of holidays? Preparing procrastination methods for the term ahead? We've got you covered!" />
        </PostRowContainer>
      </ContentWrapper>
      <Footer />
    </div>
  );
};

export default Index;