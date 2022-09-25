import Link from "next/link";

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

const HeaderContainer = styled.header`
  background-color: #A09FE3;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;

  @media ${device.tablet} {
    flex-direction: row;
  }
`

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

const Logo = styled.div`

  max-height: 120px;
  max-width: 120px;

  display: flex;

  @media ${device.tablet} {
    width: 75%;
  }
`;

const LinkContainer = styled.div`
    position: absolute;
    right: 50px;
    padding-top: 30px;
    color: white;

`



const Block = ({ element }: { element: Element }) => {
  if (element.type === "image") {
    return <ImagePlaceholder>{element.url}</ImagePlaceholder>;
  }
  return (
    <ParagraphBlock align={element.align}>
      {element.children.map(({ text, link, ...textStyle }, idx) => (
        <Text key={idx} {...textStyle}>
          {/* if link attribute is undefined, the current node is plain text */}
          {/* if link attribute is string, the curent node is a hyper link, with url link */}
          {link ? (
            <StyledLink>
                
              <Link href={link} passHref>
                {text}
              </Link>
            </StyledLink>
          ) : (
            <>{text}</>
          )}
        </Text>
      ))}
    </ParagraphBlock>
  );
};
// { elements }: { elements: Element[][] }
const Blog = ({ elements }: { elements: Element[][] }) => {
  return (
    <PageContainer>
        <HeaderContainer>
            <Logo>
                <Image src={logo} alt="Websites Icon" />
            </Logo>
            <LinkContainer>
                <Link href="/" >Homepage</Link>
            </LinkContainer>
        </HeaderContainer>
        <MainContainer>
            <Text>Blog Title</Text>
        
            <BlogContainer>
                
            </BlogContainer>

        </MainContainer>
        <Footer/>
    </PageContainer>
  );
};

export default Blog;
