import React, { useState } from "react";
import Image from "next/image";
import styled from 'styled-components'
import { content } from "../assets/sponsors.js";
import Dialog from '@mui/material/Dialog';
import Fade from '@mui/material/Fade';
import Footer from "../components/footer/Footer";

const SponsorsContainer = styled.div`
  margin: 4rem;
  font-family: 'Raleway';
`

const SponsorsHeading = styled.div`
  font-weight: 800;
  font-size: 40px;
  padding: 3rem 0;
`

const SponsorsTier = styled.div`
  font-family: 'Raleway';
  font-weight: 450;
  font-size: 25px;
`

const SponsorsLogo = styled.div`
  padding: 1rem 2rem;
  &:hover {
    transform: scale(1.04);
  }
  &:active {
    transform: scale(0.96);
  }
  cursor: pointer;
`

const SponsorsModal = styled.div`
  width: 35vw;  
  height: max-content;
  background: #ffffff;
  border-color: none;
  border-radius: 5px;
  padding: 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: 'Raleway';
`

const SponsorsTitle = styled.div`
  font-weight: 470;
  font-size: 25px;
`

const SponsorsInfo = styled.div`
  color: grey;
  font-weight: 300;
  font-size: 17px;
  line-height: 27pt;
  padding-top: 1rem;
  word-wrap: break-word;
  a{
    color: #44a6c6;
    text-decoration: underline;
  }
`

const LevelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-content: space-between;
  flex-wrap: wrap;
  border-left: 1px solid grey;
  padding-left: 2rem;
  margin: 4rem 2rem;
`

export default function Sponsors() {
  const [open, setOpen] = useState(false);
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorDescription, setSponsorDescription] = useState("");
  const handleClose = () => setOpen(false);
  let tierOne = content.filter((S) => S.level === 'P');
  let tierTwo = content.filter((S) => S.level === 'M');
  let tierThree = content.filter((S) => S.level === 'A');
  function SponsorDetails() {
    return (
      <SponsorsModal>
        <SponsorsTitle>
          {sponsorName}
        </SponsorsTitle>
        <SponsorsInfo dangerouslySetInnerHTML={{ __html: sponsorDescription }} />
      </SponsorsModal>
    );
  }
  return (
    <div>
      <SponsorsContainer>
        <SponsorsHeading>Sponsors</SponsorsHeading>
        <SponsorsTier>
          Principal Sponsors
        </SponsorsTier>
        <LevelContainer
        >
          {
            tierOne.map((Sponsor) =>
              <SponsorsLogo
                key={Sponsor.id}
              >
                <Image
                  src={`/assets/sponsors/${Sponsor.logo}`}
                  width="250px"
                  height="250px"
                  objectFit="contain"
                  onClick={() => {
                    setOpen(true);
                    setSponsorName(Sponsor.alt_text);
                    setSponsorDescription(Sponsor.description);
                  }}
                />
              </SponsorsLogo>
            )}
        </LevelContainer>
        <SponsorsTier>
          Major Sponsors
        </SponsorsTier>
        <LevelContainer
        >
          {tierTwo.map((Sponsor) =>
            <SponsorsLogo
              key={Sponsor.id}
            >
              <Image
                src={`/assets/sponsors/${Sponsor.logo}`}
                width="200px"
                height="200px"
                objectFit="contain"
                onClick={() => {
                  setOpen(true);
                  setSponsorName(Sponsor.alt_text);
                  setSponsorDescription(Sponsor.description);
                }}
              />
            </SponsorsLogo>
          )}
        </LevelContainer>
        <SponsorsTier>
          Affiliiate Sponsors
        </SponsorsTier>
        <LevelContainer
        >
          {tierThree.map((Sponsor) =>
            <SponsorsLogo
              key={Sponsor.id}
            >
              <Image
                src={`/assets/sponsors/${Sponsor.logo}`}
                width="150px"
                height="150px"
                objectFit="contain"
                onClick={() => {
                  setOpen(true);
                  setSponsorName(Sponsor.alt_text);
                  setSponsorDescription(Sponsor.description);
                }}
              />
            </SponsorsLogo>
          )}
        </LevelContainer>
      </SponsorsContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: '0px 0px 100px 8px rgba(0, 0, 0, .3)',
            borderRadius: 5,
          },
        }}
      >
        <Fade in={open}>
          <div>
            <SponsorDetails />
          </div>
        </Fade>
      </Dialog>
      <Footer />
    </div>
  );
}


