import React from "react";
import Image from "next/image";

import styled from "styled-components";

import CSESocLogo from "../../../public/assets/logo_white.svg";
import { device } from "../../styles/device";

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
          <br /><br />
          © 2021 — CSESoc UNSW
        </p>
      </Details>
    </FooterComponent>
  );
};

export default Footer;
