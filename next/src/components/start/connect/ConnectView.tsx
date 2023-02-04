import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";

import DiscordLogo from "../../../../public/assets/socials/discord_coloured.svg";
import FacebookLogo from "../../../../public/assets/socials/facebook_coloured.svg";
import InstagramLogo from "../../../../public/assets/socials/instagram_coloured.svg";
import YoutubeLogo from "../../../../public/assets/socials/youtube_coloured.svg";
import SpotifyLogo from "../../../../public/assets/socials/spotify_coloured.svg";

import DiscordScreenshot from "../../../../public/assets/csesoc_discord.png";
import FacebookScreenshot from "../../../../public/assets/csesoc_facebook.png";
import InstagramScreenshot from "../../../../public/assets/csesoc_instagram.png";
import YoutubeScreenshot from "../../../../public/assets/csesoc_youtube.png";
import SpotifyScreenshot from "../../../../public/assets/csesoc_spotify.png";

import { device } from "../../../styles/device";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  flex: 1;
  gap: 2rem;
  width: 100%;
`;

const PreviewWrapper = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
`;

const Preview = styled.div`
  position: relative;
  padding-bottom: calc(9 / 16 * 100%);
  border-radius: 4px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  overflow: hidden;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;

  gap: 0.5rem;

  @media ${device.tablet} {
    gap: 2rem;
  }

  
`;

const SocialIconImageContainer = styled.div`
  position: relative;
  height: 40px;
  width: 40px;

  @media ${device.tablet} {
    height: 60px;
    width: 60px;
  }
`;

const Button = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 100%;
  padding: 0.5rem;

  ${({ active }) =>
    active &&
    `
      box-shadow: 0 0 0 4px var(--primary-purple);
    `}

  @media ${device.tablet} {
    padding: 1rem;
  }
`;

const socialIcons = [
  {
    name: "Discord",
    icon: DiscordLogo,
    link: "https://cseso.cc/discord",
    screenshot: DiscordScreenshot,
  },
  {
    name: "Facebook",
    icon: FacebookLogo,
    link: "https://cseso.cc/fb",
    screenshot: FacebookScreenshot,
  },
  {
    name: "Instagram",
    icon: InstagramLogo,
    link: "https://www.instagram.com/csesoc_unsw/",
    screenshot: InstagramScreenshot,
  },
  {
    name: "YouTube",
    icon: YoutubeLogo,
    link: "https://cseso.cc/youtube",
    screenshot: YoutubeScreenshot,
  },
  {
    name: "Spotify",
    icon: SpotifyLogo,
    link: "https://open.spotify.com/show/2h9OxTkeKNznIfNqMMYcxj?si=5d6ccc6881a14d5f",
    screenshot: SpotifyScreenshot,
  },
];

export default function ConnectView() {
  const [activeTab, setActiveTab] = useState(socialIcons[0].name);

  return (
    <MainContainer>
      <SocialIcons>
        {socialIcons.map(({ name, icon }) => (
          <Button active={name === activeTab} key={name} onClick={() => setActiveTab(name)}>
            <SocialIconImageContainer>
              <Image src={icon.src} alt={name} objectFit="cover" layout="fill" />
            </SocialIconImageContainer>
          </Button>
        ))}
      </SocialIcons>
      <PreviewWrapper>
        <Preview>
          {socialIcons.map(
            ({ name, screenshot, link }) =>
              name === activeTab && (
                <a href={link} target="_blank" rel="noreferrer">
                  <Image layout="fill" objectFit="cover" src={screenshot.src} alt={name} />
                </a>
              ),
          )}
        </Preview>
      </PreviewWrapper>
    </MainContainer>
  );
}
