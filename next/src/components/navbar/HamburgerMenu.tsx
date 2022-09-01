import React from "react";

import Image from "next/image";
import CloseIcon from "../../../public/assets/close_icon.svg";
import LogoImg from "../../../public/assets/logo.svg";

import { NavbarOpenProps } from "./types";
import {
  MenuOverlay, MenuContainer,
  MenuHeader, MenuItemWrapper,
  MenuItem, LogoContainer, CloseButton
} from "./HamburgerMenu-styled";

const HamburgerMenu = (props: NavbarOpenProps) => {
  return (
    <MenuOverlay>
      <MenuContainer>
        { props.open ? (
          <MenuHeader>
            <LogoContainer>
              <Image src={LogoImg} />
            </LogoContainer>
            <CloseButton onClick={props.setNavbarOpen}><Image src={CloseIcon} /></CloseButton>
          </MenuHeader>
        ) : <></> }
        <MenuItemWrapper>
          <MenuItem>About Us</MenuItem>
          <MenuItem>Contact</MenuItem>
          <MenuItem>Events</MenuItem>
          <MenuItem>Resources</MenuItem>
          <MenuItem>Sponsors</MenuItem>
        </MenuItemWrapper>
      </MenuContainer>
    </MenuOverlay>
  )
};

export default HamburgerMenu;