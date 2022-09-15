import styled from "styled-components";
import HamburgerIcon from "../../../public/assets/menu_icon.svg";
import Image from "next/image";
import { NavbarOpenProps } from "./types";

import {
	Container,
	ItemWrapper,
	NavItem,
	HamburgerButton,
} from "./Navbar-styled";

const Navbar = (props: NavbarOpenProps) => {
	return (
		<Container>
			<ItemWrapper>
				<HamburgerButton onClick={props.setNavbarOpen}>
					<Image src={HamburgerIcon} />
				</HamburgerButton>
				<a href="#aboutus">
					<NavItem>About Us</NavItem>
				</a>
				<NavItem>Contact</NavItem>
				<a href="#events">
					<NavItem>Events</NavItem>
				</a>
				<NavItem>Resources</NavItem>
				<a href="#sponsors">
					<NavItem>Sponsors</NavItem>
				</a>
			</ItemWrapper>
		</Container>
	);
};

export default Navbar;
