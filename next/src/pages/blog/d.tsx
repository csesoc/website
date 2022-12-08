// import React, { useState, useEffect } from "react";
// import type { NextPage } from "next";
// import Link from 'next/link'
// import Otter from '../../svgs/otter.png'
// import Image from 'next/image';
// import Footer from "../../components/footer/Footer";
// import Navbar from "../../components/navbar/Navbar";
// import { NavbarOpenHandler, NavbarType } from "../../components/navbar/types";

// import styled from "styled-components";

// export const StyledSphere = styled.div`
// 	width: 15vw;
// 	height: 15vw;
// 	background: #E8DBFF;
// 	mix-blend-mode: normal;
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// 	border-radius: 50%;
// `;

// export const Content = styled.div`
// 	display: flex;
// 	justify-content: space-evenly;
// 	align-items: center;
// 	height: 90vh;
// `
// export const StyledBlogLinks = styled.div`
// 	padding-right: 10vw;
// 	display: flex;
// 	flex-direction: column;
// 	justify-content: center;
// 	align-items: center;
// 	height: 90vh;
// 	font-family: 'Raleway';
//   font-weight: 400;
//   font-size: 17px;
//   line-height: 27pt;
//   word-wrap: break-word;
// 	color: #000000;
// `

// export const StyledBlogTitle = styled.div`
//   font-weight: 800;
//   font-size: 40px;
//   line-height: 30pt;
//   padding-bottom: 1vw;
  
// `

// export const LinkTextStyle = styled.a`
// 	&:hover {
//     color: #44a6c6;
//   }
//   &:active {
//     color: #31738a;
//   }
//   cursor: pointer;
// `

// const Index: NextPage = () => {
//   const [navbarOpen, setNavbarOpen] = useState(false);
//   const handleToggle: NavbarOpenHandler = () => {
//     setNavbarOpen(!navbarOpen);
//   };
//   return (
//     <div>
//       <Navbar open={navbarOpen} setNavbarOpen={handleToggle} variant={NavbarType.BLOG} />
//       <Content>
//         <StyledSphere>
//           <Image src={Otter} />
//         </StyledSphere>
//         <StyledBlogLinks>
//           <StyledBlogTitle>
//             Blogs
//           </StyledBlogTitle>
//           <Link href="/blog">
//             <LinkTextStyle>Blog 1</LinkTextStyle>
//           </Link>
//           <Link href="/blog">
//             <LinkTextStyle>Blog 2</LinkTextStyle>
//           </Link>
//           <Link href="/blog">
//             <LinkTextStyle>Blog 3</LinkTextStyle>
//           </Link>
//           <Link href="/blog">
//             <LinkTextStyle>Blog 4</LinkTextStyle>
//           </Link>
//         </StyledBlogLinks>
//       </Content>
//       <Footer />
//     </div>

//   );
// };
// export default Index;