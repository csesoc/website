import Link from "next/link";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import {
  Text,
  StyledLink,
  ImagePlaceholder,
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
  flex: 1; /* whats this? */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

`;

// const Logo = styled.div`

//   max-height: 120px;
//   max-width: 120px;

//   display: flex;

//   @media ${device.tablet} {
//     width: 75%;
//   }
// `;

// const LinkContainer = styled.div`
//     position: absolute;
//     right: 50px;
//     padding-top: 30px;
//     color: white;

// `



// const Block = ({ element }: { element: Element }) => {
//   if (element.type === "image") {
//     return <ImagePlaceholder>{element.url}</ImagePlaceholder>;
//   }
//   return (
//     <ParagraphBlock align={element.align}>
//       {element.children.map(({ text, link, ...textStyle }, idx) => (
//         <Text key={idx} {...textStyle}>
//           {/* if link attribute is undefined, the current node is plain text */}
//           {/* if link attribute is string, the curent node is a hyper link, with url link */}
//           {link ? (
//             <StyledLink>
                
//               <Link href={link} passHref>
//                 {text}
//               </Link>
//             </StyledLink>
//           ) : (
//             <>{text}</>
//           )}
//         </Text>
//       ))}
//     </ParagraphBlock>
//   );
// };


// { elements }: { elements: Element[][] }
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
          <Text>Blog Title</Text>
          <Blog elements={data}/>
      </MainContainer>
      <Footer/>
    </PageContainer>
  );
};

export default BlogPage;
