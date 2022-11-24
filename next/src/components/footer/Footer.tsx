import React from "react";
import Image from "next/image";

import styled from "styled-components";

import CSESocLogo from "../../../public/assets/logo_white.svg";
import DiscordLogo from "../../../public/assets/socials/discord.svg";
import FacebookLogo from "../../../public/assets/socials/facebook.svg";
import InstagramLogo from "../../../public/assets/socials/instagram.svg";
import YoutubeLogo from "../../../public/assets/socials/youtube.svg";
import SpotifyLogo from "../../../public/assets/socials/spotify.svg";

import Link from "next/link";
import { device } from "../../styles/device";

export const ImagesContainer = styled.div`
  width: 100%;
  right: 0;
  display: flex;
  justify-content: space-between;
  @media ${device.tablet} {
    width: 55%;
    float: right;
  }
`


const FooterComponent = styled.footer`
  background-color: #A09FE3;
  padding: 2rem;
  display: flex;
  flex-direction: column;

  @media ${device.tablet} {
    flex-direction: row;
  }
`;

const Logo = styled.div`
  width: 100%;
  display: flex;

  @media ${device.tablet} {
    width: 75%;
  }
`;

const Details = styled.div`
  width: 100%;
  text-align: left;
  color: white;

  @media ${device.tablet} {
    width: 25%;
    text-align: right;
  }
`;

const Footer: React.FC<{}> = () => {
  return (
    <FooterComponent>
      <Logo>
        <Image src={CSESocLogo} alt="CSESoc" />
      </Logo>
      <Details>
        <p>
          B03 CSE Building K17, UNSW
          <br />
          csesoc@csesoc.org.au
          <br/><br/>
          <ImagesContainer>
            <Link href="https://discord.gg/AM4GB5zuB6">
              <Image src={DiscordLogo} alt="CSESoc Discord" />
            </Link>
            <Link href="https://www.facebook.com/csesoc/">
              <Image src={FacebookLogo} alt="CSESoc Facebook" />
            </Link>
            <Link href="https://www.instagram.com/csesoc_unsw/?hl=en">
              <Image src={InstagramLogo} alt="CSESoc Instagram" />
            </Link>
            <Link href="https://www.youtube.com/c/CSESocUNSW">
              <Image src={YoutubeLogo} alt="CSESoc Youtube" />
            </Link>
            <Link href="https://open.spotify.com/show/2h9OxTkeKNznIfNqMMYcxj">
              <Image src={SpotifyLogo} alt="Echo Podcast" />
            </Link>
          </ImagesContainer>
          <br /><br />
          © 2022 — CSESoc UNSW
        </p>
      </Details>
    </FooterComponent>
  );
};

export default Footer;
