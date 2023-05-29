import React from "react";

import Image from "next/image";
import CloseIcon from "../../../public/assets/close_icon.svg";
import LogoImg from "../../../public/assets/logo.svg";

import { HamburgerMenuProps } from "./types";
import {
  MenuOverlay, MenuContainer,
  MenuHeader, MenuItemWrapper,
  MenuItem, LogoContainer, CloseButton
} from "./HamburgerMenu-styled";

const HamburgerMenu = (props: HamburgerMenuProps) => {
  return (
    <MenuOverlay>
      <MenuContainer>
        {props.open ? (
          <MenuHeader>
            <LogoContainer>
              <Image src={LogoImg} />
            </LogoContainer>
            <CloseButton onClick={props.setNavbarOpen}><Image src={CloseIcon} /></CloseButton>
          </MenuHeader>
        ) : <></>}
        <MenuItemWrapper>
          <MenuItem as="a" href="/Start">Future Students</MenuItem>
          <MenuItem as="a" href="/AboutUs">About Us</MenuItem>
          <MenuItem as="a" href="/ExecDescription">History</MenuItem>
          <MenuItem as="a" href="#events">Events</MenuItem>
          <MenuItem as="a" href="#resources">Resources</MenuItem>
          <MenuItem as="a" href="/Sponsors">Sponsors</MenuItem>
        </MenuItemWrapper>
      </MenuContainer>
    </MenuOverlay>
  )
};

export default HamburgerMenu;