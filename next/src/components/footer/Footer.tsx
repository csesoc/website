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
    width: 75%;
    float: right;
  }
`


const FooterComponent = styled.footer`
  background-color: #A09FE3;
  width: 100vw;
  padding: 2rem;
  display: flex;
  margin-top: 1.5em;
  flex-direction: column;
  position: static;
  bottom: 0;
  @media ${device.tablet} {
    flex-direction: row;
  }
`;

const Logo = styled.div`
  width: 50%;
  display: flex;
  padding-bottom: 5vmin;

  @media ${device.tablet} {
    padding-bottom: 0vmin;

    width: 75%;
    padding-left: 10vmin;
  }
`;

const Details = styled.div`
  width: 100%;
  text-align: left;
  color: white;
  font-size: min(3vmin, 32px);
  line-height: min(3.5vmin, 45px);

  @media ${device.tablet} {
    width: 40%;
    text-align: right;
    padding-right: 10vmin;
  }
`;

const Footer: React.FC<{}> = () => {
  return (
    <FooterComponent>
      <Logo>
        <Image src={CSESocLogo} alt="CSESoc" />
      </Logo>
      <Details>
        <div>
          B03 CSE Building K17, UNSW
          <br />
          csesoc@csesoc.org.au
          <br /><br />
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
        </div>
      </Details>
    </FooterComponent>
  );
};

export default Footer;
