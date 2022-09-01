import styled from 'styled-components';
import HamburgerIcon from "../../../public/assets/menu_icon.svg";
import Image from 'next/image';
import { NavbarOpenProps } from "./types";

import {
    Container, ItemWrapper,
    NavItem, HamburgerButton
} from "./Navbar-styled";

const Navbar = (props: NavbarOpenProps) => {
    return (
      <Container>
        <ItemWrapper>
            <HamburgerButton onClick={props.setNavbarOpen}><Image src={HamburgerIcon} /></HamburgerButton>
            <NavItem>About Us</NavItem>
            <NavItem>Contact</NavItem>
            <NavItem>Events</NavItem>
            <NavItem>Resources</NavItem>
            <NavItem>Sponsors</NavItem>
        </ItemWrapper>
      </Container>
    );
}   

export default Navbar;
