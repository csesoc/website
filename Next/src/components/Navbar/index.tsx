import styled from 'styled-components';
import { useState, useEffect } from 'react';
import HamburgerIcon from './hamburger_icon.png';
import Image from 'next/image';

const Navbar = styled.div`
    padding: 30px 0 30px 0;
    background: #fafcff;
    display: flex;
`

const ItemWrapper = styled.ul`
    margin-left: auto;
`

const NavItem = styled.li`
    padding: 0 50px 0 50px;
    display: inline;
    font-size: 20px;
    font-weight: bold;

    @media (max-width: 768px) {
        display: none;
    }
`

const HamburgerButton = styled.button`
    display: none;
    @media (max-width: 768px) {
        display: block;
    }
`

// const HamburgerIconContainer = styled.img`
//
// `

const NavbarComponent = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);

    const handleToggle = () => {
        setNavbarOpen(!navbarOpen)
    };

    return (
      <Navbar>
        <ItemWrapper>
            <HamburgerButton onClick={handleToggle}><Image src={HamburgerIcon} /></HamburgerButton>
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
