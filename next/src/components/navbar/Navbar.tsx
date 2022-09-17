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
} from "./Navbar-styled";

//     background-color: #A09FE3

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
          <Container style={{backgroundColor: "#A09FE3"}}> 
            <Image src={WebsitesIcon} objectFit="contain" objectPosition="left"/>
              <ItemWrapper>
                  <HamburgerButton onClick={props.setNavbarOpen}>
                      <Image src={HamburgerIcon} />
                  </HamburgerButton>
                  <a href="#homepage">
                      <NavItem style={{color: "#FFFFFF"}}>Homepage</NavItem>
                  </a>
              </ItemWrapper>
          </Container>
      );
    }
};

export default Navbar;
