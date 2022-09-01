import React from "react";
import Image from "next/image";

import styled from "styled-components";

import CSESocLogo from "../../../public/assets/logo_white.svg";

const FooterComponent = styled.footer`
  background-color: #A09FE3;
  padding: 2rem;
  display: flex;
`;

const Logo = styled.div`
  width: 75%;
`;

const LogoImage = styled(Image)`
  vertical-align: middle;
`;

const Details = styled.div`
  width: 25%;
  text-align: right;
  color: white;
`;

const Footer: React.FC<{}> = () => {
  return (
    <FooterComponent>
      <Logo>
        <LogoImage src={CSESocLogo} alt="CSESoc" />
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
