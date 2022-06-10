import styled from 'styled-components';
import HamburgerIcon from "../../../public/assets/menu_icon.svg";
import Image from 'next/image';
import { NavbarOpenProps } from "../../pages/blog/types";

const Navbar = styled.div`
    position: sticky;
    top: 0;
    width: 100%;
    height: 20vh;
    padding: 20px 0;
    background: transparent;
    display: flex;
`

const ItemWrapper = styled.ul`
    display: inline-flex;
    align-items: center;
    margin-left: auto;
    gap: 5vw;
    list-style: none;
`

const NavItem = styled.li`
    font-size: 20px;
    font-weight: bold;

    @media (max-width: 768px) {
        display: none;
    }
`
const HamburgerButton = styled.button`
    width: fit-content;
    height: auto;
    cursor: pointer;
    background-color: transparent;
    border: none;
    display: none;
    @media (max-width: 768px) {
        display: block;
    }
`

const NavbarComponent = (props: NavbarOpenProps) => {
    return (
      <Navbar>
        <ItemWrapper>
            <HamburgerButton onClick={props.setNavbarOpen}><Image src={HamburgerIcon} /></HamburgerButton>
            <NavItem>About Us</NavItem>
            <NavItem>Contact</NavItem>
            <NavItem>Events</NavItem>
            <NavItem>Resources</NavItem>
            <NavItem>Sponsors</NavItem>
        </ItemWrapper>
      </Navbar>
    );
}   

export default NavbarComponent;
