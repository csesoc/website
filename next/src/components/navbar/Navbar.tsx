import styled from "styled-components";
import HamburgerIcon from "../../../public/assets/menu_icon.svg";
import Image from "next/image";
import { NavbarOpenProps, NavbarType } from "./types";
import Link from "next/link";
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
  switch (props.variant) {
    case NavbarType.HOMEPAGE:
      return (
        <Container>
          <ItemWrapper>
            <HamburgerButton onClick={props.setNavbarOpen}>
              <Image src={HamburgerIcon} />
            </HamburgerButton>
            <Link href="/Start">
              <NavItem>Future Students</NavItem>
            </Link>
            <Link href="/AboutUs">
              <NavItem>About Us</NavItem>
            </Link>
            <Link href="/ExecDescription">
              <NavItem>History</NavItem>
            </Link>
            <Link href="#events">
              <NavItem>Events</NavItem>
            </Link>
            <Link href="#resources">
              <NavItem>Resources</NavItem>
            </Link>
            <Link href="/Sponsors">
              <NavItem>Sponsors</NavItem>
            </Link>
          </ItemWrapper>
        </Container>
      );
    case NavbarType.MINIPAGE:
      return (
        <MiniPageContainer>
          <ImageWrapper>
            <Link href="/">
              <Image src="/assets/WebsitesIcon.png" layout="fill" objectFit="contain" objectPosition="left" />
            </Link>

          </ImageWrapper>

          <HomepageButton>
            <Link href="/">
              <div style={{ color: "#FFFFFF" }}>Homepage</div>
            </Link>
          </HomepageButton>

        </MiniPageContainer >
      );
  }
};

export default Navbar;
