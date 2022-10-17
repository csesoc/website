import React, { useState } from "react";
import Footer from "../components/footer/Footer";
import Navbar from "../components/navbar/Navbar";
import { NavbarOpenHandler, NavbarType } from "../components/navbar/types";
import styled from "styled-components";

const MainContainer = styled.div`
  padding: '9vw 5vw',
  fontFamily: 'Raleway',
  fontWeight: 450,
  fontSize: '15px',
`;

export default function AboutUs() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const handleToggle: NavbarOpenHandler = () => {
    setNavbarOpen(!navbarOpen);
  };
  return (
    <div>
      <Navbar open={navbarOpen} setNavbarOpen={handleToggle} variant={NavbarType.MINIPAGE} />
      {/* <div
        style={{
          padding: '9vw 5vw',
          fontFamily: 'Raleway',
          fontWeight: 450,
          fontSize: '15px',
        }}
      > */}
      <MainContainer>
          <h1>About</h1>
          <p>
            CSESoc is the official representative body of computing students at
            UNSW. We are one of the largest and most active societies at UNSW, and
            the largest computing society in the southern hemisphere. CSESoc
            comprises ~9,500 UNSW students spanning across degrees in Computer
            Science, Software Engineering, Bioinformatics and Computer Engineering.
            We are here to fulfil the social, personal and professional needs of CSE
            students, and promote computing through a variety of forms.
          </p>
          <p>
            We are a society for the students, by the students. Here’s an overview
            of what we do;
          </p>
          <ul>
            <li>
              Run weekly social and educational events, including trivia, movie,
              boardgames nights, LAN parties, workshops, coding competitions, tech
              talks, and our famous free weekly BBQ.
            </li>
            <li>
              Create original media content, including Podcasts, articles, YouTube
              videos, and live streams
            </li>
            <li>
              Run a highly successful First Year Camp and Peer Mentoring program,
              offering new CSE students (both undergraduate and postgraduate) a
              chance to meet and mingle with other newcomers
            </li>
            <li>
              Engage students with industry sponsors and representatives to develop
              their professional capacity and curiosity
            </li>
            <li>
              Develop our own open-source projects for students to get learn new
              skills and develop tools for our community
            </li>
            <li>
              Facilitate an online community of ~3k Discord users, ~5k Facebook
              followers, ~600 YouTube subs, and ~500 Instagram followers
            </li>
          </ul>

          <h1>2022 Statistics</h1>
          <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
            <li>🥳 100+ events (more on the way!) 🥳</li>
            <li>📸 40+ media articles, podcast, videos, streams 📸</li>
            <li>💸 32 sponsors 💸</li>
            <li>💬 400 000 discord messages 💬</li>
            <li>✨ 190 volunteers ✨</li>
            <li>📼 40 000 Youtube views 📼</li>
            <li>📼 600+ Youtube Subs 📼</li>
            <li>🚸 500+ high school students reached 🚸</li>
            <li>🧥374 hoodies 🧥</li>
            <li>😷 250 face masks 😷</li>
          </ul>
      </MainContainer>
      <Footer />
    </div>
  );
}
