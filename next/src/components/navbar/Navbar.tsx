import styled from "styled-components";
import HamburgerIcon from "../../../public/assets/menu_icon.svg";
import Image from "next/image";
import { NavbarOpenProps, NavbarType } from "./types";
import WebsitesIcon from "../../../public/assets/WebsitesIcon.png";

import {
	Container,
	ItemWrapper,
	NavItem,
	HamburgerButton,
  ImageWrapper,
  MiniPageContainer,
  HomepageButton
} from "./Navbar-styled";

const Navbar = (props: NavbarOpenProps) => {
  switch(props.variant) {
    case NavbarType.HOMEPAGE:
        return (
          <Container> 
              <ItemWrapper>
                  <HamburgerButton onClick={props.setNavbarOpen}>
                      <Image src={HamburgerIcon} />
                  </HamburgerButton>
                  <a href="#aboutus">
                      <NavItem>About Us</NavItem>
                  </a>
                  <a href="#events">
                      <NavItem>Events</NavItem>
                  </a>
                  <a href="#resources">
                      <NavItem>Resources</NavItem>
                  </a>
                  <a href="#support">
                      <NavItem>Sponsors</NavItem>
                  </a>
              </ItemWrapper>
          </Container>
        );
    case NavbarType.MINIPAGE:
      return (
          <MiniPageContainer>
            <ImageWrapper>
              <a href="#homepage">
                <Image src="/assets/WebsitesIcon.png" layout="fill" objectFit="contain" objectPosition="left"/>
              </a>
              
            </ImageWrapper>

            <HomepageButton>
              <a href="#homepage">
                <div style={{color: "#FFFFFF"}}>Homepage</div>
              </a>
            </HomepageButton>

          </MiniPageContainer>
      );
    }
};

export default Navbar;
